//import { authorize, refresh } from 'react-native-app-auth';
import { authorize, refresh, revoke } from 'react-native-app-auth';

/*const keycloakConfig = {
  issuer: 'https://keycloak.astromyllc.com/realms/SootingStar',
  clientId: 'mobileClient',
  redirectUrl: 'academix://oauthredirect',
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: {},
  dangerouslyAllowInsecureHttpRequests: false, // true only for development without HTTPS
};*/

const keycloakConfig = {
  issuer: 'https://keycloak.astromyllc.com/realms/SootingStar',
  clientId: 'mobileClient',
  redirectUrl: 'academix://oauthredirect',
  scopes: ['openid', 'profile', 'email'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://keycloak.astromyllc.com/realms/SootingStar/protocol/openid-connect/auth',
    tokenEndpoint: 'https://keycloak.astromyllc.com/realms/SootingStar/protocol/openid-connect/token',
    revocationEndpoint: 'https://keycloak.astromyllc.com/realms/SootingStar/protocol/openid-connect/revoke'
  },
  dangerouslyAllowInsecureHttpRequests: false,
};

// Login function
async function login() {
  try {
    const result = await authorize(keycloakConfig);
    
    // Store tokens securely
    await SecureStore.setItemAsync('access_token', result.accessToken);
    await SecureStore.setItemAsync('refresh_token', result.refreshToken);
    await SecureStore.setItemAsync('id_token', result.idToken);
    
    return {
      success: true,
      tokens: result
    };
  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function logout(accessToken) {
  try {
    await revoke(keycloakConfig, {
      tokenToRevoke: accessToken,
      includeBasicAuth: true,
      sendClientId: true
    });
    
    // Clear stored tokens
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('id_token');
    
    return true;
  } catch (error) {
    console.error('Logout Error:', error);
    return false;
  }
}
