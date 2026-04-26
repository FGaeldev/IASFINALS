/**
 * @file hooks/useAuth.js
 * @description Custom React hook for reading the current user's session state.
 *
 * Calls the backend `me` endpoint on mount to verify whether a valid session
 * exists and retrieve the user's ID and role. Used by ProtectedRoute and Navbar
 * to conditionally render content based on authentication state.
 *
 * Return values:
 *   undefined  — Session check in progress (initial state, prevents flash of wrong content)
 *   null       — No valid session (user is not authenticated)
 *   { id, role } — Active session (user is authenticated)
 *
 * The three-state design (undefined / null / object) is intentional:
 *   - undefined prevents ProtectedRoute from redirecting before the check completes
 *   - null triggers redirect to /login
 *   - object grants access and determines which routes/UI to show
 */

import { useEffect, useState } from "react";
import { getMe } from "../services/authService";

/**
 * Checks the current session and returns the authenticated user's data.
 *
 * @returns {undefined|null|{id: number, role: string}}
 *   - undefined while the session check is pending
 *   - null if no valid session exists
 *   - user object { id, role } if authenticated
 */
export default function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading, not "no user"

  useEffect(() => {
    getMe().then((data) => {
      if (data.success) {
        setUser(data.data); // { id, role }
      } else {
        setUser(null); // No valid session
      }
    });
  }, []);

  return user;
}
