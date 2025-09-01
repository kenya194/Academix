// apiService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Strings from "./Strings.json";
import { Alert } from 'react-native';

// Example API base config
const api = axios.create({
  baseURL: Strings.URL,
  timeout: 15000,
  withCredentials: true, // to enable cookies
});

export const makePostCall = async (url, data) => {
    console.log("URL - "+ url)
    console.log(`POST ${api.defaults.baseURL}${url}`);
  try {
    const accessToken = await SecureStore.getItemAsync('auth_token');
    
 const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await api.post(url, data, { headers });
    return response.data;

  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
};



export const handleMenuAction = async ({ endpoint, payload, navigation, screen }) => {
  try {
    console.log(`Calling ${endpoint} with`, payload);

    const response = await makePostCall(endpoint, payload); // raw server response

    let formattedData = response;

    if (screen === "Results" && response?.studentReportResponseList?.length > 0) {
      const student = response.studentReportResponseList[0]; // assuming one student
      const assessments = student.studentAssessment || [];

      // Map to the Results.js structure
      formattedData = {
        summary: {
          averageGrade: parseFloat(student.averageScore || "0").toFixed(1),
          totalSubjects: assessments.length,
          highestGrade: Math.max(...assessments.map(a => parseFloat(a.totalScore || 0))).toFixed(1),
          lowestGrade: Math.min(...assessments.map(a => parseFloat(a.totalScore || 0))).toFixed(1),
          attendance: "95%", // optional if you have it
        },
        results: assessments.map((a, idx) => ({
          id: `${idx + 1}`,
          subject: a.subject,
          grade: a.grade,
          score: parseFloat(a.totalScore || 0),
          maxScore: 100, // Assuming fixed max score
          term: a.term,
          teacher: "N/A", // Replace if available
          comments: a.gradeRemarks || "",
          lastUpdated: a.dateTime,
        })),
      };
    }

    navigation.navigate(screen, { data: formattedData });
  } catch (err) {
    console.error("API call failed:", err);
    Alert.alert("Info", `Failed to load data for ${screen}`);
  }
};
