import React, { createContext } from "react";

export const AuthContext = React.createContext({
  onLogin: () => {},
  onLogout: () => {},
  token: null,
});
