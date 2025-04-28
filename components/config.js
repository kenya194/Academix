import { authorize, refresh } from 'react-native-app-auth';

const keycloakConfig = {
  issuer: 'https://keycloak.astromyllc.com/realms/SootingStar',
  clientId: 'mobileClient',
  redirectUrl: 'academix://oauthredirect',
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: {},
  dangerouslyAllowInsecureHttpRequests: false, // true only for development without HTTPS
};

// Login function
async function login() {
  try {
    const result = await authorize(keycloakConfig);
    console.log('Access Token:', result.accessToken);
    console.log('Refresh Token:', result.refreshToken);
    console.log('ID Token:', result.idToken);
    // You can now use accessToken to call your APIs
  } catch (error) {
    console.error('Login Error', error);
  }
}
