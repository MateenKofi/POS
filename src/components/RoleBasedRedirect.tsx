import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Handles initial redirect based on user role.
 * Runs on mount when user is authenticated.
 * Redirects cashier to /sales, others to /.
 * Only runs on /login or / paths.
 */
export const RoleBasedRedirect = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user && !isLoading) {
      const currentPath = location.pathname
      // Only redirect if on login page or root
      if (currentPath === "/login" || currentPath === "/") {
        const defaultRoute =
          user.role === "cashier" ? "/sales" : "/"
        if (currentPath !== defaultRoute) {
          navigate(defaultRoute, { replace: true })
        }
      }
    }
  }, [user, isLoading, navigate, location.pathname])

  return null
}
