/**
 * @file components/ProtectedRoute.jsx
 * @description Route guard that restricts access to authenticated users with the correct role.
 *
 * Renders children only when:
 *   1. A valid session exists (user is not null/undefined)
 *   2. The user's role matches the required role (if specified)
 *
 * Uses `replace` on all Navigate redirects so that unauthorized access attempts
 * do not add entries to the browser history stack. Without `replace`, a user
 * who lands on a protected route while unauthenticated could press Back and
 * re-trigger the redirect loop.
 *
 * Three-state auth pattern (from useAuth):
 *   undefined  → session check in-flight, render loading indicator
 *   null       → no session, redirect to /login
 *   { id, role } → authenticated, render children if role matches
 *
 * @dependencies react-router-dom (Navigate), hooks/useAuth
 */

import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Wraps a route element and enforces authentication and role requirements.
 *
 * @param {React.ReactNode} children  - The protected page component to render.
 * @param {string|string[]} [role]    - Required role or array of roles. If omitted,
 *                                      any authenticated user is allowed through.
 * @returns {React.ReactNode} The children, a loading indicator, or a redirect.
 */
export default function ProtectedRoute({ children, role }) {
  const user = useAuth();

  // Session check still pending — render nothing meaningful to avoid
  // flashing the wrong UI before auth state is known.
  if (user === undefined) return <p>Loading...</p>;

  // No valid session — redirect to login.
  // `replace` removes this attempted route from history so pressing Back
  // after login does not loop back through the redirect.
  if (!user) return <Navigate to="/login" replace />;

  // Role check — if a role requirement is specified, verify the user qualifies.
  // Redirect to home (not login) since the user IS authenticated, just unauthorized.
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children;
}