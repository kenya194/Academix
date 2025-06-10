import * as SecureStore from 'expo-secure-store';
import { refreshAsync } from 'expo-auth-session';

export const refreshToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');

  const result = await refreshAsync(
    {
      clientId: 'mobileClient',
      refreshToken,
    },
    discovery
  );

  await SecureStore.setItemAsync('access_token', result.accessToken);
  return result.accessToken;
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('access_token');
};

export const revokeToken = async () => {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (!refreshToken) return;
  
    try {
      await fetch(discovery.revocationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'mobileClient',
          token: refreshToken,
          token_type_hint: 'refresh_token',
        }).toString(),
      });
    } catch (error) {
      console.error('Revocation failed:', error);
    }
  };