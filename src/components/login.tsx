"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Eye, EyeOff } from "lucide-react"

interface LoginProps {
  onLogin: (user: { username: string; role: "manager" | "cashier" }) => void
}

interface LoginFormData {
  username: string
  password: string
}

// Mock users for demonstration
const mockUsers = [
  { username: "manager", password: "manager123", role: "manager" as const },
  { username: "cashier", password: "cashier123", role: "cashier" as const },
]

const Login = ({ onLogin }: LoginProps) => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === data.username && u.password === data.password
      )

      if (user) {
        onLogin({ username: user.username, role: user.role })
      } else {
        setError("Invalid username or password")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">POS System Login</CardTitle>
          <p className="text-slate-600">Sign in to access the system</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="pl-10"
                  {...register("username", { required: "Username is required" })}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                <strong>Manager:</strong> manager / manager123
              </p>
              <p>
                <strong>Cashier:</strong> cashier / cashier123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
