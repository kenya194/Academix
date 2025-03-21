// src/screens/Results.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    averageGrade: '0',
    totalSubjects: 0,
    highestGrade: '0',
    lowestGrade: '0',
    attendance: '0%'
  });
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const fetchResultsData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        { 
          id: '1',
          subject: 'Mathematics',
          grade: 'A',
          score: 92,
          maxScore: 100,
          term: 'Term 1',
          teacher: 'Dr. Smith',
          comments: 'Excellent performance in advanced calculus',
          lastUpdated: '2024-03-15'
        },
        { 
          id: '2',
          subject: 'Physics',
          grade: 'B+',
          score: 87,
          maxScore: 100,
          term: 'Term 1',
          teacher: 'Prof. Johnson',
          comments: 'Good understanding of core concepts',
          lastUpdated: '2024-03-15'
        },
        { 
          id: '3',
          subject: 'Computer Science',
          grade: 'A-',
          score: 89,
          maxScore: 100,
          term: 'Term 1',
          teacher: 'Dr. Williams',
          comments: 'Strong programming skills demonstrated',
          lastUpdated: '2024-03-15'
        },
        { 
          id: '4',
          subject: 'English Literature',
          grade: 'A',
          score: 95,
          maxScore: 100,
          term: 'Term 1',
          teacher: 'Ms. Brown',
          comments: 'Outstanding analytical essays',
          lastUpdated: '2024-03-15'
        },
        { 
          id: '5',
          subject: 'History',
          grade: 'B',
          score: 85,
          maxScore: 100,
          term: 'Term 1',
          teacher: 'Mr. Davis',
          comments: 'Good historical analysis',
          lastUpdated: '2024-03-15'
        }
      ];

      setResults(mockResults);
      
      // Calculate summary
      const scores = mockResults.map(r => r.score);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highest = Math.max(...scores);
      const lowest = Math.min(...scores);
      
      setSummary({
        averageGrade: average.toFixed(1),
        totalSubjects: mockResults.length,
        highestGrade: highest.toString(),
        lowestGrade: lowest.toString(),
        attendance: '95%'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load results data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResultsData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchResultsData();
  }, []);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return '#4CAF50';
      case 'A-':
        return '#8BC34A';
      case 'B+':
        return '#FFC107';
      case 'B':
        return '#FF9800';
      case 'B-':
        return '#FF5722';
      default:
        return '#F44336';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading results...</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>Academic Results</Text>
        <View style={styles.termSelector}>
          <TouchableOpacity 
            style={[styles.termButton, selectedTerm === 'Term 1' && styles.selectedTerm]}
            onPress={() => setSelectedTerm('Term 1')}
          >
            <Text style={[styles.termButtonText, selectedTerm === 'Term 1' && styles.selectedTermText]}>Term 1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.termButton, selectedTerm === 'Term 2' && styles.selectedTerm]}
            onPress={() => setSelectedTerm('Term 2')}
          >
            <Text style={[styles.termButtonText, selectedTerm === 'Term 2' && styles.selectedTermText]}>Term 2</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.termButton, selectedTerm === 'Term 3' && styles.selectedTerm]}
            onPress={() => setSelectedTerm('Term 3')}
          >
            <Text style={[styles.termButtonText, selectedTerm === 'Term 3' && styles.selectedTermText]}>Term 3</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Average Grade</Text>
          <Text style={styles.summaryValue}>{summary.averageGrade}%</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Subjects</Text>
          <Text style={styles.summaryValue}>{summary.totalSubjects}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Highest Grade</Text>
          <Text style={styles.summaryValue}>{summary.highestGrade}%</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Lowest Grade</Text>
          <Text style={styles.summaryValue}>{summary.lowestGrade}%</Text>
        </View>
      </View>

      <View style={styles.resultsList}>
        {results.map((result) => (
          <TouchableOpacity 
            key={result.id}
            style={styles.resultCard}
            onPress={() => Alert.alert(
              result.subject,
              `Score: ${result.score}/${result.maxScore}\nTeacher: ${result.teacher}\nComments: ${result.comments}\nLast Updated: ${new Date(result.lastUpdated).toLocaleDateString()}`
            )}
          >
            <View style={styles.resultHeader}>
              <View style={styles.subjectContainer}>
                <Ionicons name="book-outline" size={24} color="#666" />
                <Text style={styles.subject}>{result.subject}</Text>
              </View>
              <View style={[styles.gradeBadge, { backgroundColor: `${getGradeColor(result.grade)}20` }]}>
                <Text style={[styles.grade, { color: getGradeColor(result.grade) }]}>{result.grade}</Text>
              </View>
            </View>
            <View style={styles.resultDetails}>
              <Text style={styles.score}>{result.score}/{result.maxScore}</Text>
              <Text style={styles.teacher}>{result.teacher}</Text>
            </View>
          </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  termSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 5,
  },
  termButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedTerm: {
    backgroundColor: '#4CAF50',
  },
  termButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedTermText: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryCard: {
    width: '50%',
    padding: 15,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsList: {
    padding: 15,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  grade: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    fontSize: 14,
    color: '#666',
  },
  teacher: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default Results;