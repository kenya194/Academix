// hooks/useUserActivity.js
import { useEffect } from 'react';
import { AppState } from 'react-native';

const useUserActivity = (onActivity) => {
  useEffect(() => {
    // Track app state changes
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        onActivity();
      }
    });

    // Track touch events
    const handleTouch = () => onActivity();
    
    // For React Native, we need to use the root view
    const rootView = require('react-native').UIManager.getViewManagerConfig('RCTView') 
      ? require('react-native').findNodeHandle(require('react-native').AppRegistry.rootTag) 
      : null;
    
    if (rootView) {
      require('react-native').NativeModules.UIManager.measure(rootView, () => {
        require('react-native').DeviceEventEmitter.addListener('touchStart', handleTouch);
        require('react-native').DeviceEventEmitter.addListener('touchEnd', handleTouch);
      });
    }

    return () => {
      appStateSubscription.remove();
      if (rootView) {
        require('react-native').DeviceEventEmitter.removeListener('touchStart', handleTouch);
        require('react-native').DeviceEventEmitter.removeListener('touchEnd', handleTouch);
      }
    };
  }, [onActivity]);
};

export default useUserActivity;