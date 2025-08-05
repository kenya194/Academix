import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makePostCall, handleMenuAction } from "../apiService";
import { LineChart, RadarChart, HeatmapChart } from "../charts";
import theme from "../theme";

// Add this debug line right after imports:
console.log("Imported RadarChart:", RadarChart); // Should log a function

import React, { useState, useEffect } from "react";
const { width } = Dimensions.get("window");

const Dashboard = ({ navigation, selectedStudent }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [activeChart, setActiveChart] = useState("trend");

  const trendImg = require("../assets/trendImg.png");
  const perfImg = require("../assets/performanceImg.png");
  const attendImg = require("../assets/attendImg.png");

  //Sample data
  const radarData = [
    { label: "Math", value: 85 },
    { label: "Science", value: 78 },
    { label: "History", value: 42 },
    { label: "English", value: 100 },
    { label: "Arts", value: 75 },
    { label: "Sports", value: 30 },
  ];

  //Sample linear Data
  const trendData = [
    { label: "Jan", value: 50 },
    { label: "Feb", value: 60 },
    { label: "Mar", value: 75 },
    { label: "Apr", value: 90 },
    { label: "May", value: 45 },
  ];

  //Sample linear Data
  const attendData = [
    { month: "Jan", week: 1, absences: 2 },
    { month: "Jan", week: 2, absences: 1 },
    { month: "Jan", week: 3, absences: 2 },
    { month: "Jan", week: 4, absences: 4 },
    { month: "Feb", week: 1, absences: 2 },
    { month: "Feb", week: 2, absences: 0 },
    { month: "Feb", week: 3, absences: 5 },
    { month: "Feb", week: 4, absences: 0 },
    { month: "Mar", week: 1, absences: 2 },
    { month: "Mar", week: 2, absences: 0 },
    { month: "Mar", week: 3, absences: 2 },
    { month: "Mar", week: 4, absences: 0 },
    { month: "Apr", week: 1, absences: 2 },
    { month: "Apr", week: 2, absences: 0 },
    { month: "Apr", week: 3, absences: 2 },
    { month: "Apr", week: 4, absences: 0 },
  ];

  const fetchStudentData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStudent({
        name: selectedStudent.name,
        picture: selectedStudent.picture,
        studentId: selectedStudent.studentId,
        course: "Computer Science",
        semester: "3rd Semester",
      });
    } catch (error) {
      Alert.alert("Info", "Failed to load student data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentData();
      // Fetch or display data for selectedStudent.id
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStudentData();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const modules = [
    { screen: "Profile", icon: "person", label: "Profile" },
    { screen: "Results", icon: "document-text", label: "Results" },
    { screen: "Fees", icon: "wallet", label: "Fees" },
    { screen: "Settings", icon: "settings", label: "Settings" },
    { screen: "Notification", icon: "notifications", label: "Notifications" },
    { screen: "About", icon: "information-circle", label: "About" },
  ];

  const menuItems = [
    {
      id: "profile",
      icon: "person-outline",
      label: "Profile",
      screen: "Profile",
      color: "#4CAF50",
    },
    {
      id: "results",
      icon: "book-outline",
      label: "Results",
      screen: "Results",
      color: "#2196F3",
    },
    {
      id: "fees",
      icon: "wallet-outline",
      label: "Fees Status",
      screen: "Fees",
      color: "#FF9800",
    },
    {
      id: "attendance",
      icon: "calendar-outline",
      label: "Attendance",
      screen: "Attendance",
      color: "#9C27B0",
    },
    {
      id: "assignments",
      icon: "document-text-outline",
      label: "Assignments",
      screen: "Assignments",
      color: "#F44336",
    },
    {
      id: "notifications",
      icon: "notifications-outline",
      label: "Notifications",
      screen: "Notifications",
      color: "#607D8B",
    },
  ];

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {imageError ? (
              <Ionicons
                name="person-circle-outline"
                size={100}
                color="#4CAF50"
              />
            ) : (
              <Image
                source={{ uri: student?.picture }}
                style={styles.profileImage}
                onError={handleImageError}
              />
            )}
          </View>
          <Text style={styles.name}>{student?.name || "Student Name"}</Text>
          <Text style={styles.studentId}>
            {student?.studentId || "Student ID"}
          </Text>
          <Text style={styles.courseInfo}>
            {student?.course || "Course"} • {student?.semester || "Semester"}
          </Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItemContainer,
                {
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                  opacity: fadeAnim,
                  animationDelay: index * 100,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const screenName = item.screen.toLowerCase();
                  const excludedScreens = ["profile", "notifications"];

                  // Only call the API if NOT going to "Profile"
                  if (!excludedScreens .includes(screenName)) {
                    const endpoint = `api/mobile/${screenName}Data`;
                    const payload = { val: student?.studentId };

                    handleMenuAction({
                      endpoint,
                      payload,
                      navigation,
                      screen: item.screen,
                    });
                  } else {
                    // Just navigate without API call
                    navigation.navigate(item.screen);
                  }
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Ionicons name={item.icon} size={30} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View style={styles.chatMain}>
          <View style={styles.chartNav}>
            <TouchableOpacity
              style={styles.chartNavContent}
              onPress={() => setActiveChart("trend")}
            >
              <Image
                source={trendImg}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chartNavContent}
              onPress={() => setActiveChart("radar")}
            >
              <Image
                source={perfImg}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chartNavContent}
              onPress={() => setActiveChart("heatmap")}
            >
              <Image
                source={attendImg}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          
          <View style={styles.chartArea}>
            {activeChart === "trend" && (
              <View style={styles.chartPlaceholder}>
                <LineChart data={trendData} color="#2196F3" />
              </View>
            )}
            {activeChart === "radar" && (
              <RadarChart
                data={radarData}
                containerWidth="100%"
                containerHeight={220}
              />
            )}
            {activeChart === "heatmap" && (
              <View style={styles.chartPlaceholder}>
                <HeatmapChart
                  data={attendData}
                  colorRange={["#fff7ec", "#fee8c8", "#fdbb84", "#d7301f"]}
                  containerWidth={width * 0.69}
                  fixedHeight={210} 
                />
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
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
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // or "space-between" depending on layout
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  chartNav: {
    width: "15%",
    borderRadius: 10,
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  chartNavContent: {
    width: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eeeeee",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10, // optional for spacing
  },
  chartArea: {
    width: "80%",
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eeeeee",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
  },
chartPlaceholder: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
  profileImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  studentId: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  courseInfo: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 5,
  },
  menuItemContainer: {
    width: (width - 70) / 3,
    marginBottom: 10,
  },
  menuItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default Dashboard;
