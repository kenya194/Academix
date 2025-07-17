// src/screens/Profile.js
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "./dashboard";

const Profile = ({ navigation, selectedStudent }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudentData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStudent({
        id: "STU2024001",
        name: "Kenya",
        grade: "10th Grade",
        email: "kenya@gmail.com",
        phone: "+233554184099",
        studentId: "2024001",
        course: "Computer Science",
        semester: "3rd Semester",
        // department: "Science",
        dateOfBirth: "2005-05-15",
        address: "123 School Street, City, Country",
        profilePicture: "https://via.placeholder.com/150",
        emergencyContact: "+1987654321",
        // bloodGroup: "O+",
        enrollmentDate: "2023-09-01",
      });
    } catch (error) {
      Alert.alert("Info", "Failed to load profile data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStudentData();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    // Add edit functionality here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons
              name={isEditing ? "checkmark" : "pencil"}
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Email" value={student?.email} icon="mail-outline" />
          <InfoRow label="Phone" value={student?.phone} icon="call-outline" />
          <InfoRow
            label="Date of Birth"
            value={formatDate(student?.dateOfBirth)}
            icon="calendar-outline"
          />
          {/* <InfoRow
            label="Blood Group"
            value={student?.bloodGroup}
            icon="water-outline"
          /> */}

        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Grade" value={student?.grade} icon="school-outline" />
          <InfoRow label="Course" value={student?.course} icon="book-outline" />
          <InfoRow
            label="Semester"
            value={student?.semester}
            icon="layers-outline"
          />
          {/* <InfoRow
            label="Department"
            value={student?.department}
            icon="business-outline"
          /> */}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.infoCard}>
          <InfoRow
            label="Address"
            value={student?.address}
            icon="location-outline"
          />
          <InfoRow
            label="Emergency Contact"
            value={student?.emergencyContact}
            icon="medical-outline"
          />
          <InfoRow
            label="Enrollment Date"
            value={formatDate(student?.enrollmentDate)}
            icon="calendar-number-outline"
          />
        </View>
      </View>

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

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelContainer}>
      <Ionicons name={icon} size={20} color="#666" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
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
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
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
    marginBottom: 5,
  },
  studentId: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 5,
  },
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
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
