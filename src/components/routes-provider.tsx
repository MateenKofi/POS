import { Routes, Route } from "react-router-dom"
import { Login } from "@/pages/authentication/login"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AuthenticatedRoutes } from "@/components/AuthenticatedRoutes"
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect"

/**
 * Main routing component.
 * - Public route: /login
 * - Protected routes via <AuthenticatedRoutes />
 * - Fallback redirect to /login
 * - Handles role-based initial redirect (cashier → /sales, others → /)
 */
export const RoutesProvider = () => {
  return (
    <>
      <RoleBasedRedirect />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes - all wrapped in ProtectedRoute */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AuthenticatedRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
