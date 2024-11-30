import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const userAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("auth_token") ?? "";

      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp >= currentTime) {
          setSession(token);
        } else {
          localStorage.removeItem("auth_token");
          setSession(null);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  return [session, loading];
};

export default userAuth;
