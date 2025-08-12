import { useState, useEffect, useContext, useCallback  } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "./dashboard";
import Profile from "./profilePage";
import Results from "./resultsPage";
import NotificationPage from "./notificationPage";
import Fees from "./feeStatus";
import Login from "./login";
import StudentAccountList from "./StudentAccountList";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../AuthContext";
import { makePostCall } from "../apiService";
import InactiveAccountScreen from "./InactiveAccountScreen";
import {
  getUsernameFromToken,
  getGroups,
  getUserIDFromToken,
} from "../components/jwtUtils";
import { navigationRef } from "../App";
import axios from "axios";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const AppNavigator = () => {
  const { isLoggedIn, onLogin, onLogout, token } = useContext(AuthContext);
  const username = getUsernameFromToken(token);
  const groups = getGroups(token);
  const userId = getUserIDFromToken(token);

  console.log(
    "NOW IN THE APP NAVIGATOR FILE with userName AND GROUP WITH USER ID{}\n" +
      isLoggedIn +
      " \n" +
      username +
      " \n" +
      groups +
      " \n" +
      userId
  );

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navigationReady, setNavigationReady] = useState(false);

  // Define killKeycloakSession function
  const killKeycloakSession = async (userId, adminCredentials, realmConfig) => {
    const { serverUrl, realm } = realmConfig;
    const { username, password } = adminCredentials;

    try {
      // 1. Get admin access token
      const tokenResponse = await axios.post(
        `${serverUrl}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: "admin-cli",
          username: username,
          password: password,
          grant_type: "password",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const adminToken = tokenResponse.data.access_token;

      // 2. Kill user session
      await axios.post(
        `${serverUrl}/admin/realms/${realm}/users/${userId}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to kill session:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Memoized killSession function
  const killSession = useCallback(async (userId) => {
    try {
      console.log("Attempting to kill Session for user:", userId);
      const success = await killKeycloakSession(
        userId,
        {
          username: "admin",
          password: "IdowhatIlikeIlikewhatIdo!@3",
        },
        {
          serverUrl: "https://keycloak.astromyllc.com",
          realm: "ShootingStar",
        }
      );

      if (success) {
        console.log("Session terminated successfully");
        return true;
      }
    } catch (error) {
      console.error("Error terminating session:", error);
      return false;
    }
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      await onLogout(); // Assuming onLogout is from your AuthContext
      // Add any other cleanup you need
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [onLogout]);

  useEffect(() => {
    const handleUnauthorizedAccess = async () => {
      console.log("Checking unauthorized access");
      if (groups && !groups.includes("parents") && userId) {
        console.log("Unauthorized access detected for user:", userId);

        const sessionKilled = await killSession(userId);

        if (sessionKilled) {
          setTimeout(() => {
            Alert.alert("Access Denied", "You don't have parent permissions.", [
              {
                text: "OK",
                onPress: handleLogout,
              },
            ]);
          }, 100);
        }
      }
    };

    handleUnauthorizedAccess();
  }, [groups, userId, killSession, handleLogout]);

  useEffect(() => {
    const postData = async () => {
      try {
        const payload = { val: username };
        const result = await makePostCall(
          "api/mobile/getSkimpStudentsByParentContact",
          payload
        );

        console.log("Raw API result:", result);

        const formatted = result.map((student, index) => ({
          id: (index + 1).toString(), // Your sequential ID
          studentId: student.studentId,
          name: `${student.firstName} ${student.otherName || ""} ${
            student.lastName
          }`
            .trim()
            .replace(/\s+/g, " "),
          dateOfAdmission: student.dateOfAdmission,
          gender: student.gender,
          nationality: student.nationality,
          institutionCode: student.institutionCode,
          studentClass: student.studentClass,
          picture:
            student.picture && student.picture.trim() !== ""
              ? student.picture
              : "https://example.com/default-picture.jpg",
          status: "inactive", // student.status,
          parents: student.parents
            ? student.parents.map((parent) => ({
                id: parent.id,
                fullName: `${parent.firstNames} ${parent.lastName}`.trim(),
                email: parent.email,
                primaryContact: parent.contact1,
                secondaryContact: parent.contact2 || null,
                occupation: parent.occupation,
                placeOfWork: parent.placeOfWork,
                parentType: parent.parentType,
                institutionCode: parent.institutionCode,
              }))
            : [],
        }));

        setStudents(formatted);
        setSelectedStudent(formatted[0]);

        console.log("Formatted result:", formatted);
      } catch (err) {
        console.error("Post call failed:", err);
      }
    };

    postData();
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
    {
      id: "notifications",
      label: "Notifications",
      screen: "Notifications",
      icon: "notifications",
      color: "#FF5722",
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
        headerStyle: { height: 80 },
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
        {(props) => {
          // Redirect to InactiveAccountScreen if student is inactive
          if (selectedStudent?.status === "inactive") {
            return (
              <InactiveAccountScreen
                {...props}
                route={{ params: { student: selectedStudent } }}
              />
            );
          }
          return <Dashboard {...props} selectedStudent={selectedStudent} />;
        }}
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
        {(props) => {
          if (selectedStudent?.status === "inactive") {
            return (
              <InactiveAccountScreen
                {...props}
                route={{ params: { student: selectedStudent } }}
              />
            );
          }
          return <Profile {...props} selectedStudent={selectedStudent} />;
        }}
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
        {(props) => {
          if (selectedStudent?.status === "inactive") {
            return (
              <InactiveAccountScreen
                {...props}
                route={{ params: { student: selectedStudent } }}
              />
            );
          }
          return <Results {...props} selectedStudent={selectedStudent} />;
        }}
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
        {(props) => {
          if (selectedStudent?.status === "inactive") {
            return (
              <InactiveAccountScreen
                {...props}
                route={{ params: { student: selectedStudent } }}
              />
            );
          }
          return <Fees {...props} selectedStudent={selectedStudent} />;
        }}
      </Drawer.Screen>

      <Drawer.Screen
        name="Notifications"
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
        {(props) => {
          if (selectedStudent?.status === "inactive") {
            return (
              <InactiveAccountScreen
                {...props}
                route={{ params: { student: selectedStudent } }}
              />
            );
          }
          return (
            <NotificationPage {...props} selectedStudent={selectedStudent} />
          );
        }}
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
