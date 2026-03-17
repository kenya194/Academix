import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = ({ navigation, selectedStudent }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState(selectedStudent); 
  const [isEditing, setIsEditing] = useState(false);

  /* ---------- Helpers ---------- */
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ---------- Get primary parent ---------- */
  const getPrimaryParent = () => {
    if (!student?.parents || student.parents.length === 0) return null;
    // Find mother first, then father, then first parent
    return (
      student.parents.find((p) => p.parentType?.toLowerCase() === "mother") ||
      student.parents.find((p) => p.parentType?.toLowerCase() === "father") ||
      student.parents[0]
    );
  };

  const primaryParent = getPrimaryParent();

  /* ---------- Refresh ---------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Here you would typically refetch the student data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  /* ---------- Handle edit / save ---------- */
  const handleEdit = async () => {
    if (isEditing) {
      // save
      try {
        const res = await makePostCall(
          "api/mobile/getSkimpStudentsByParentContact",
            JSON.stringify(student),
        );
        if (!res.ok) throw new Error("Save failed");
        Alert.alert("Success", "Profile updated successfully!");
      } catch (e) {
        Alert.alert("Error", e.message || "Failed to update profile");
        return; // stay in edit mode if save fails
      }
    }
    setIsEditing((prev) => !prev);
  };

  /* ---------- UI ---------- */
  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4CAF50"]}
        />
      }
    >
      {/* ---- Header ---- */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: student.picture }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.studentId}>ID: {student.studentId}</Text>
      </View>

      {/* ---- Personal Info ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guardian Information</Text>
          {primaryParent && (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons
                name={isEditing ? "checkmark" : "pencil"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            label="Email"
            icon="mail-outline"
            value={primaryParent?.email || "N/A"}
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, email: text } : p
                ),
              }));
            }}
          />
          <InfoRow
            label="Primary Contact"
            icon="call-outline"
            value={
              primaryParent?.primaryContact || primaryParent?.contact1 || "N/A"
            }
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, contact1: text } : p
                ),
              }));
            }}
          />
          <InfoRow
            label="Secondary Contact"
            icon="call-outline"
            value={primaryParent?.contact2 || "N/A"}
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, contact2: text } : p
                ),
              }));
            }}
          />
          <InfoRow
            label="Occupation"
            icon="briefcase-outline"
            value={primaryParent?.occupation || "N/A"}
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, occupation: text } : p
                ),
              }));
            }}
          />
          <InfoRow
            label="Place of Work"
            icon="location-outline"
            value={primaryParent?.placeOfWork || "N/A"}
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, placeOfWork: text } : p
                ),
              }));
            }}
          />
          <InfoRow
            label="Relation"
            icon="people-outline"
            value={primaryParent?.parentType || "N/A"}
            editable={isEditing}
            onChange={(text) => {
              if (!primaryParent) return;
              setStudent((prev) => ({
                ...prev,
                parents: prev.parents.map((p) =>
                  p.id === primaryParent.id ? { ...p, parentType: text } : p
                ),
              }));
            }}
          />
        </View>
      </View>

      {/* ---- Ward Info ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Student Information</Text>
        </View>
        <View style={styles.infoCard}>
          <InfoRow
            label="Class"
            icon="school-outline"
            value={student.studentClass || "N/A"}
          />
          <InfoRow
            label="Gender"
            icon="person-outline"
            value={student.gender || "N/A"}
          />
          <InfoRow
            label="Nationality"
            icon="earth-outline"
            value={student.nationality || "N/A"}
          />
          <InfoRow
            label="Admission Date"
            icon="calendar-number-outline"
            value={formatDate(student.dateOfAdmission)}
          />
        </View>
      </View>

      {/* ---- Additional Info ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
        </View>
        <View style={styles.infoCard}>
          <InfoRow
            label="Address"
            icon="location-outline"
            value={student?.address}
            editable={isEditing}
            onChange={(text) => setStudent((p) => ({ ...p, address: text }))}
          />
          <InfoRow
            label="Emergency Contact"
            icon="medical-outline"
            value={student?.emergencyContact}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, emergencyContact: text }))
            }
          />
          <InfoRow
            label="Enrollment Date"
            icon="calendar-number-outline"
            value={
              isEditing
                ? student?.enrollmentDate
                : formatDate(student?.enrollmentDate)
            }
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, enrollmentDate: text }))
            }
          />
        </View>
      </View>

      {/* ---- Home Btn ---- */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert("Home", "Navigating Back to Home page", [
            { text: "Cancel", style: "cancel" },
            { text: "Home", onPress: () => navigation.navigate("Dashboard") },
          ])
        }
      >
        <Ionicons name="home" size={24} color="#23eb84c7" />
        <Text style={styles.logoutText}>Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ---------- Re‑usable Row ---------- */
const InfoRow = ({ label, value, icon, editable = false, onChange }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      <Ionicons name={icon} size={20} color="#666" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    {editable ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChange}
        placeholder={label}
      />
    ) : (
      <Text style={styles.infoValue}>{value}</Text>
    )}
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },

  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  profileImageContainer: { position: "relative", marginBottom: 15 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    padding: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  studentId: { fontSize: 16, color: "#666" },

  section: { padding: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  editButton: { padding: 5 },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabelContainer: { flexDirection: "row", alignItems: "center" },
  infoLabel: { fontSize: 16, color: "#666", marginLeft: 10 },
  infoValue: { fontSize: 16, color: "#333", fontWeight: "500" },
  infoInput: {
    minWidth: 120,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "right",
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 4,
    color: "#333",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutText: {
    color: "#65e7d4",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default Profile;
