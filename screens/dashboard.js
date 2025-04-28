// src/screens/Dashboard.js
import React, { useState, useEffect } from 'react';
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
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchStudentData = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudent({
        name: 'John Doe',
        picture: 'https://via.placeholder.com/150',
        studentId: 'STU2024001',
        course: 'Computer Science',
        semester: '3rd Semester'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load student data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

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

  const menuItems = [
    {
      id: 'profile',
      icon: 'person-outline',
      label: 'Profile',
      screen: 'Profile',
      color: '#4CAF50'
    },
    {
      id: 'results',
      icon: 'book-outline',
      label: 'Results',
      screen: 'Results',
      color: '#2196F3'
    },
    {
      id: 'fees',
      icon: 'wallet-outline',
      label: 'Fees Status',
      screen: 'Fees',
      color: '#FF9800'
    },
    {
      id: 'attendance',
      icon: 'calendar-outline',
      label: 'Attendance',
      screen: 'Attendance',
      color: '#9C27B0'
    },
    {
      id: 'assignments',
      icon: 'document-text-outline',
      label: 'Assignments',
      screen: 'Assignments',
      color: '#F44336'
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notifications',
      screen: 'Notifications',
      color: '#607D8B'
    }
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
      }
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {imageError ? (
              <Ionicons name="person-circle-outline" size={100} color="#4CAF50" />
            ) : (
              <Image 
                source={{ uri: student?.picture }} 
                style={styles.profileImage}
                onError={handleImageError}
              />
            )}
          </View>
          <Text style={styles.name}>{student?.name || 'Student Name'}</Text>
          <Text style={styles.studentId}>{student?.studentId || 'Student ID'}</Text>
          <Text style={styles.courseInfo}>{student?.course || 'Course'} • {student?.semester || 'Semester'}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                styles.menuItemContainer,
                {
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }],
                  opacity: fadeAnim,
                  animationDelay: index * 100
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon} size={30} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  studentId: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  courseInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
  },
  menuItemContainer: {
    width: (width - 70) / 3,
    marginBottom: 10,
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Dashboard;