import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Analytics = () => {
  // Sample data
  const gradesData = {
    labels: ['Term 1', 'Term 2', 'Term 3'],
    datasets: [
      {
        data: [78, 85, 92],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Average Grade'],
  };

  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [95, 97, 93, 90, 96, 98],
      },
    ],
  };

  const feesData = [
    { name: 'Paid', population: 80, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Unpaid', population: 20, color: '#F44336', legendFontColor: '#333', legendFontSize: 14 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Overview</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance Trend</Text>
        <LineChart
          data={gradesData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Attendance (%)</Text>
        <BarChart
          data={attendanceData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fees Status</Text>
        <PieChart
          data={feesData}
          width={screenWidth - 40}
          height={180}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  chart: {
    borderRadius: 12,
  },
});

export default Analytics; 