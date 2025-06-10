import React, { useRef, useEffect } from 'react';
import { View, FlatList, Animated, TouchableOpacity, StyleSheet,Text,Alert } from 'react-native';
import StudentCard from './StudentCard';
import { Ionicons } from '@expo/vector-icons';

const StudentAccountList = ({ 
  students, 
  navigation, 
  menuItems, 
  onSelectStudent,
  onLogout // Add this prop
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectStudent(item)}>
      <StudentCard
        student={item}
        navigation={navigation}
        menuItems={menuItems}
        fadeAnim={fadeAnim}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Add Logout Button at Bottom */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: onLogout }
              ]
            );
          }}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B3010', // Slight red background
  },
  logoutText: {
    color: '#FF3B30',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StudentAccountList;