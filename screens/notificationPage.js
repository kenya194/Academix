// src/screens/Notifications.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificationCard from './NotificationCard';

const Notifications = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchNoticeData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchNoticeData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockNotifications = [
        {
          id: '1',
          type: 'announcement',
          title: 'School Reopening',
          date: '2023-09-01T08:00:00',
          details: 'School will reopen on September 5th after the summer break.'
        },
        {
          id: '2',
          type: 'event',
          title: 'Sports Day',
          date: '2023-09-15T09:30:00',
          details: 'Annual sports day event will be held on September 15th.'
        },
        {
          id: '3',
          type: 'academic',
          title: 'Exam Schedule',
          date: '2023-10-01T10:00:00',
          details: 'Mid-term exams will begin from October 10th.'
        },
        {
          id: '4',
          type: 'fee',
          title: 'Fee Payment Reminder',
          date: '2023-09-10T14:00:00',
          details: 'Last date for fee payment is September 15th.'
        },
        {
          id: '5',
          type: 'alert',
          title: 'Weather Alert',
          date: '2023-09-08T16:45:00',
          details: 'School will remain closed tomorrow due to heavy rain forecast.'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNoticeData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
          />
        }
      >
        <NotificationCard notifications={notifications} fadeAnim={fadeAnim} />
      </ScrollView>

      {/* Fixed Home Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for fixed button
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
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Notifications;