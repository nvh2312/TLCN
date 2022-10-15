import React, { createContext, useState } from "react";

const AuthContext = createContext();
const AuthProvider = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const values = { userInfo, setUserInfo };

  return (
    <AuthContext.Provider {...props} value={values}></AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
