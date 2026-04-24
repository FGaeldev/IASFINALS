import { useEffect, useState } from "react";
import { getMe } from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState(undefined); // IMPORTANT

  useEffect(() => {
    getMe().then((data) => {
      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    });
  }, []);

  return user;
}