import React, { useState, useEffect, useContext } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "./dashboard";
import Profile from "./profilePage";
import Results from "./resultsPage";
import Fees from "./feeStatus";
import Login from "./login";
import StudentAccountList from "./StudentAccountList";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../AuthContext";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const AppNavigator = () => {
  const { isLoggedIn, onLogin, onLogout } = useContext(AuthContext);

  console.log("NOW IN THE APP NAVIGATOR FILE  -" + isLoggedIn);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Replace this with a real API fetch
    const fetchedStudents = [
      {
        id: "1",
        name: "John Doe",
        studentId: "S001",
        course: "Computer Science",
        semester: "Fall 2023",
        picture: "https://example.com/student1.jpg",
      },
      {
        id: "2",
        name: "Jane Doe",
        studentId: "S002",
        course: "Mathematics",
        semester: "Spring 2024",
        picture: "https://example.com/student2.jpg",
      },
      {
        id: "3",
        name: "Jim Beam",
        studentId: "S003",
        course: "Physics",
        semester: "Fall 2023",
        picture: "https://example.com/student3.jpg",
      },
    ];
    setStudents(fetchedStudents);
    setSelectedStudent(fetchedStudents[0]); // Select the first student by default
  }, []);

  const peopleItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      screen: "Dashboard",
      icon: "home",
      color: "#4CAF50",
    },
    {
      id: "profile",
      label: "Profile",
      screen: "Profile",
      icon: "person",
      color: "#2196F3",
    },
    {
      id: "results",
      label: "Results",
      screen: "Results",
      icon: "stats-chart",
      color: "#FF9800",
    },
    {
      id: "fees",
      label: "Fees",
      screen: "Fees",
      icon: "cash",
      color: "#9C27B0",
    },
  ];

  if (!isLoggedIn) {
      console.log("Login component is:", Login);
    return (
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={() => null}
      >
        <Drawer.Screen name="Login">
          {(props) => <Login {...props} onLogin={onLogin} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(drawerProps) => (
        <StudentAccountList
          students={students}
          navigation={drawerProps.navigation}
          peopleItems={peopleItems}
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            drawerProps.navigation.closeDrawer();
          }}
          onLogout={onLogout}
        />
      )}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { height: 80 }, // custom header height
        drawerStyle: {
          width: Math.max(width * 0.35, 20),
          paddingTop: 80,
          backgroundColor: "#fff",
        },
        overlayColor: "#ffffff29",
        gestureEnabled: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="people" size={28} color="#4CAF50" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Dashboard"
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="people" size={28} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Dashboard {...props} selectedStudent={selectedStudent} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Profile"
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="people" size={28} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Profile {...props} selectedStudent={selectedStudent} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Results"
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="people" size={28} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Results {...props} selectedStudent={selectedStudent} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Fees"
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="people" size={28} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <Fees {...props} selectedStudent={selectedStudent} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: "auto",
  },
  drawerFooterText: {
    fontSize: 12,
    color: "#888",
  },
});

export default AppNavigator;
