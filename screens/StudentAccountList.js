import React, { useRef } from "react";
import { FlatList, Animated } from "react-native";
import StudentCard from "./StudentCard";

const StudentAccountList = ({ students, navigation, menuItems }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const students = [
    {
      id: '1',
      name: 'John Doe',
      studentId: 'S001',
      course: 'Computer Science',
      semester: 'Fall 2023',
      picture: 'https://example.com/student1.jpg'
    },
    {
      id: '2',
      name: 'John Doe',
      studentId: 'S001',
      course: 'Computer Science',
      semester: 'Fall 2023',
      picture: 'https://example.com/student1.jpg'
    },
    {
      id: '3',
      name: 'John Doe',
      studentId: 'S001',
      course: 'Computer Science',
      semester: 'Fall 2023',
      picture: 'https://example.com/student1.jpg'
    },
    // More students...
  ];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <StudentCard
      student={item}
      navigation={navigation}
      menuItems={menuItems}
      fadeAnim={fadeAnim}
    />
  );

  return (
    <FlatList
      data={students}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default StudentAccountList;
