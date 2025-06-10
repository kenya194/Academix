import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function useNavigationState(token) {
  const navigation = useNavigation();

  useEffect(() => {
    const checkNavigation = async () => {
      const currentToken = await SecureStore.getItemAsync('auth_token');
      if (currentToken && !navigation.isFocused()) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    };
    
    const interval = setInterval(checkNavigation, 1000);
    return () => clearInterval(interval);
  }, [token, navigation]);
}