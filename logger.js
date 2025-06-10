import { logger } from 'react-native-logs';

const config = {
  severity: 'debug',
  // Replace existing transport with this:
  transport: (msg) => {
    console.log('[FORCED LOG]', msg); // Bypasses all formatting
  },
  // Optional: Keep transportOptions if needed elsewhere
  transportOptions: {
    colors: 'ansi', // Simplified color setup
  },
};

const log = logger.createLogger(config);
export default log;