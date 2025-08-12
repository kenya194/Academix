// components/SessionWarningModal.js
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const SessionWarningModal = ({ visible, onExtend, onLogout }) => (
  <Modal transparent visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Session Expiring Soon</Text>
        <Text style={styles.message}>
          Your session will expire in 5 minutes due to inactivity.
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Stay Logged In" onPress={onExtend} />
          <Button title="Log Out Now" onPress={onLogout} color="#ff4444" />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default SessionWarningModal;