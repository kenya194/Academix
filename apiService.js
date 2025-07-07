// apiService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Strings from "./Strings.json";

// Example API base config
const api = axios.create({
  baseURL: Strings.LOCALURL,
  timeout: 10000,
  withCredentials: true, // to enable cookies
});

export const makePostCall = async (url, data) => {
    console.log("URL - "+ url)
    console.log(`POST ${api.defaults.baseURL}${url}`);
  try {
    const accessToken = await SecureStore.getItemAsync('auth_token');
    console.info('TOKEN: ', accessToken);
    
 const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };

    const response = await api.post(url, data, { headers });
    return response.data;

  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
};
