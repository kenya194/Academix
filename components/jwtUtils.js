import { Buffer } from 'buffer';
import axios from 'axios';

export const getUsernameFromToken = (token) => {
  function decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1]; // payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Invalid JWT", e);
      return null;
    }
  }

  const decoded = decodeJWT(token);
  console.log(decoded);

  // Assuming the username is stored in 'username' or 'sub' in the payload
  return decoded ? decoded.preferred_username : null;
};

export const getUserIDFromToken = (token) => {
  function decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1]; // payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Invalid JWT", e);
      return null;
    }
  }

  const decoded = decodeJWT(token);
  console.log(decoded);

  // Assuming the username is stored in 'username' or 'sub' in the payload
  return decoded ? decoded.sub : null;
};

export const getGroups = (token) => {
  if (!token) return null;
  function decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1]; // payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Invalid JWT", e);
      return null;
    }
  }

  const decoded = decodeJWT(token);
  console.log(decoded.groups);

  return decoded ? decoded.groups : null;
};

export const killKeycloakSession = async (userId, adminCredentials, realmConfig) => {
  const { serverUrl, realm } = realmConfig;
  const { username, password } = adminCredentials;

  try {
    // 1. Get admin access token
    const tokenResponse = await axios.post(
      `${serverUrl}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: 'admin-cli',
        username: username,
        password: password,
        grant_type: 'password'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const adminToken = tokenResponse.data.access_token;

    // 2. Kill user session
    await axios.post(
      `${serverUrl}/admin/realms/${realm}/users/${userId}/logout`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Failed to kill session:', error.response?.data || error.message);
    throw new Error('Failed to terminate session');
  }
};
