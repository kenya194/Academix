// src/screens/Fees.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Fees = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    dueAmount: 0
  });

  const fetchFeesData = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFees = [
        { 
          id: '1',
          term: 'Term 1',
          amount: 50000,
          dueDate: '2024-01-15',
          status: 'Paid',
          paymentDate: '2024-01-10',
          transactionId: 'TRX001'
        },
        { 
          id: '2',
          term: 'Term 2',
          amount: 50000,
          dueDate: '2024-04-15',
          status: 'Pending',
          paymentDate: null,
          transactionId: null
        },
        { 
          id: '3',
          term: 'Term 3',
          amount: 50000,
          dueDate: '2024-07-15',
          status: 'Unpaid',
          paymentDate: null,
          transactionId: null
        },
      ];

      setFees(mockFees);
      
      // Calculate summary
      const total = mockFees.reduce((sum, fee) => sum + fee.amount, 0);
      const paid = mockFees
        .filter(fee => fee.status === 'Paid')
        .reduce((sum, fee) => sum + fee.amount, 0);
      const pending = mockFees
        .filter(fee => fee.status === 'Pending')
        .reduce((sum, fee) => sum + fee.amount, 0);
      const due = mockFees
        .filter(fee => fee.status === 'Unpaid')
        .reduce((sum, fee) => sum + fee.amount, 0);

      setSummary({
        totalAmount: total,
        paidAmount: paid,
        pendingAmount: pending,
        dueAmount: due
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load fees data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeesData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFeesData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Unpaid':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading fees data...</Text>
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
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Amount</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(summary.totalAmount)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Paid</Text>
          <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
            {formatCurrency(summary.paidAmount)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={[styles.summaryAmount, { color: '#FF9800' }]}>
            {formatCurrency(summary.pendingAmount)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Due</Text>
          <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
            {formatCurrency(summary.dueAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.feesList}>
        <Text style={styles.sectionTitle}>Fee Details</Text>
        {fees.map((fee) => (
          <TouchableOpacity 
            key={fee.id} 
            style={styles.feeItem}
            onPress={() => Alert.alert('Fee Details', 
              `Amount: ${formatCurrency(fee.amount)}\nDue Date: ${formatDate(fee.dueDate)}\nPayment Date: ${formatDate(fee.paymentDate)}\nTransaction ID: ${fee.transactionId || 'N/A'}`
            )}
          >
            <View style={styles.feeItemHeader}>
              <Text style={styles.term}>{fee.term}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(fee.status)}20` }]}>
                <Ionicons 
                  name={fee.status === 'Paid' ? 'checkmark-circle' : 
                        fee.status === 'Pending' ? 'time' : 'alert-circle'} 
                  size={16} 
                  color={getStatusColor(fee.status)} 
                />
                <Text style={[styles.status, { color: getStatusColor(fee.status) }]}>
                  {fee.status}
                </Text>
              </View>
            </View>
            <View style={styles.feeItemDetails}>
              <Text style={styles.amount}>{formatCurrency(fee.amount)}</Text>
              <Text style={styles.dueDate}>Due: {formatDate(fee.dueDate)}</Text>
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
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
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
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  feesList: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  feeItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  term: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  feeItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default Fees;