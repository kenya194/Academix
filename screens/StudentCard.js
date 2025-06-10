import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StudentCard = ({ student, navigation, menuItems, fadeAnim }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => setImageError(true);

  return (
    <Animated.View style={[styles.content, { opacity: fadeAnim }]}> 
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          {imageError ? (
            <Ionicons name="person-circle-outline" size={50} color="#4CAF50" />
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, padding: 8 },
  header: {
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: '#e0e1eb',
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  profileImage: { width: '50%', height: '50%' },
  name: { fontSize: 10, fontWeight: 'bold', marginTop: 10, color: '#333' },
  studentId: { fontSize: 8, color: '#666', marginTop: 5 },
  courseInfo: { fontSize: 6, color: '#888', marginTop: 5 },
});


export default StudentCard;
