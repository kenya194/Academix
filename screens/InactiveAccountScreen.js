import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makePostCall } from "../apiService";
import { AuthContext } from "../AuthContext";

const InactiveAccountScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const { username } = useContext(AuthContext);

  // Find the parent whose contact matches the account username
  const getMatchingParent = () => {
    if (!student.parents || !username) return null;

    return student.parents.find(
      (parent) => parent.contact1 === username || parent.contact2 === username
    );
  };

  const handleReactivate = async () => {
    const matchingParent = getMatchingParent();

  
    console.log("Formarting Data");
    // Call API to send reactivation email
    const payload = {
      key: ["studentId", "email"],
      val: [
        student?.studentId || "",
        matchingParent?.email || "kenten.astromyllc@gmail.com",
      ],
    };

    // Proper logging of the payload
    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

    try {
      const result = await makePostCall(
        "api/mobile/sendReactivationEmail",
        payload
      );

      console.log("API Response:", result);

      Alert.alert(
        "Email Sent",
        "An account reactivation email has been sent to the registered email address.",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to send reactivation email. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={80} color="#FF5722" />
      <Text style={styles.title}>Account Inactive</Text>
      <Text style={styles.message}>
        {student.name}'s account is currently inactive. To reactivate, click the
        button below.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleReactivate}>
        <Text style={styles.buttonText}>Send Reactivation Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#FF5722",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default InactiveAccountScreen;
