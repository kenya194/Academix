import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import { Alert } from "react-native";
import { useEffect, useContext } from "react";
import log from "../logger";
import { AuthContext } from "../AuthContext";

const Stack = createStackNavigator();
let renderCount = 0;

export default function LoginStack({ onLogin }) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    console.log("DIRECT CONSOLE TEST - should appear in Metro");
    log.debug("Logger test - might not appear");
  }, []);

  renderCount++;
  log.debug(`LoginStack render #${renderCount}`, { onLogin });

  useEffect(() => {
    const timer = setTimeout(() => {
    }, 1000);
    return () => clearTimeout(timer);
  }, [onLogin]);

  // ✅ THIS IS WHAT YOU'RE MISSING
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {() => <Login onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
