
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
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  /* ---------- Helpers ---------- */
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ---------- Mock fetch ---------- */
  const fetchStudentData = async () => {
    try {
      console.log (selectedStudent)
      await new Promise((r) => setTimeout(r, 1000)); // simulate API delay
      setStudent({
        id: "STU2024001",
        studentId: "2024001",
        profilePicture: "https://via.placeholder.com/150",
        name: selectedStudent.name,
        
        email: "kenya@gmail.com",
        primaryContact: "+233554184099",
        secondaryContact: "+23320458789",
        placeOfWork: "University of Energy",
        relation: "Mother",
        occupation: "Lecturer",

        grade: "Year 2",
        course: "Science",
        semester: "1st Semester",
        department: "Science",

        address: "123 School Street, City, Country",
        emergencyContact: "+1987654321",
        enrollmentDate: "2023-09-01",
      });
    } catch (e) {
      Alert.alert("Info", "Failed to load profile data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData();
  }, []);

  /* ---------- Handle edit / save ---------- */
  const handleEdit = async () => {
    if (isEditing) {
      // save
      try {
        const res = await fetch(
          "https://your-api-url.com/update-student", // <-- replace
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
          }
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
  if (loading && !refreshing) {
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
            source={{ uri: student?.profilePicture }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{student?.name}</Text>
        <Text style={styles.studentId}>ID: {student?.studentId}</Text>
      </View>

      {/* ---- Personal Info ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guardian Information</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons
              name={isEditing ? "checkmark" : "pencil"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            label="Email"
            icon="mail-outline"
            value={student?.email}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, email: text }))
            }
          />
          <InfoRow
            label="Primary Contact"
            icon="call-outline"
            value={student?.primaryContact}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, primaryContact: text }))
            }
          />
          <InfoRow
            label="Secondary Contact"
            icon="call-outline"
            value={student?.secondaryContact}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, secondaryContact: text }))
            }
          />
          <InfoRow
            label="occupation"
            icon="briefcase-outline"
            value={student?.occupation}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, occupation: text }))
            }
          />
          <InfoRow
            label="Place of Work"
            icon="location-outline"
            value={student?.placeOfWork}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, placeOfWork: text }))
            }
          />
          <InfoRow
            label="Relation"
            icon="people-outline"
            value={student?.relation}
            editable={isEditing}
            onChange={(text) =>
              setStudent((p) => ({ ...p, relation: text }))
            }
          />
        </View>
      </View>

      {/* ---- Ward Info ---- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Wards' Information</Text>
        </View>
        <View style={styles.infoCard}>
          <InfoRow label="Grade" icon="school-outline" value={student?.grade} />
          <InfoRow label="Course" icon="book-outline" value={student?.course} />
          <InfoRow
            label="Semester"
            icon="layers-outline"
            value={student?.semester}
          />
          <InfoRow
            label="Department"
            icon="business-outline"
            value={student?.department}
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
            onChange={(text) =>
              setStudent((p) => ({ ...p, address: text }))
            }
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
  name: { fontSize: 24, fontWeight: "bold", color: "#333", 
    textAlign: 'center', marginBottom: 5 },
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
