import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import { useEffect } from "react";
import log from "../logger";

const Stack = createStackNavigator();
let renderCount = 0;

export default function LoginStack({ onLogin }) {

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

 
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {() => <Login onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
