import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NotificationCard = ({ notifications, fadeAnim }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "announcement":
        return "megaphone-outline";
      case "event":
        return "calendar-outline";
      case "alert":
        return "alert-circle-outline";
      case "academic":
        return "school-outline";
      case "fee":
        return "cash-outline";
      default:
        return "notifications-outline";
    }
  };

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNotificationPress = (notification) => {
    Alert.alert(notification.title, notification.details);
  };

  return (
    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <View style={styles.resultsList}>
        {notifications.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>
            No notifications available
          </Text>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.resultCard}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.resultHeader}>
                <View style={styles.subjectContainer}>
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color="#666"
                  />
                  <Text style={styles.subject}>{notification.title}</Text>
                </View>
                <View style={styles.dateBadge}>
                  <Text style={styles.date}>
                    {formatNotificationDate(notification.date)}
                  </Text>
                </View>
              </View>
              <View style={styles.resultDetails}>
                <Text style={styles.notificationDetails}>
                  {notification.details}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  resultsList: {
    padding: 15,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  dateBadge: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  resultDetails: {
    marginTop: 5,
  },
  notificationDetails: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default NotificationCard;