"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface LoginFormData {
  username: string
  password: string
}

const Login = () => {
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const handleLogin = async (data: LoginFormData) => {
    setError("")

    try {
      const success = await login(data.username, data.password)
      if (!success) {
        setError("Invalid username or password")
      }
    } catch {
      setError("Login failed. Please try again.")
    }
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
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Demo Accounts</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                disabled={isLoading}
                onClick={async () => {
                  setError("")
                  const success = await login("admin", "admin123")
                  if (!success) setError("Login failed")
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Admin</span>
                  <span className="text-[10px] text-slate-500">admin123</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700"
                disabled={isLoading}
                onClick={async () => {
                  setError("")
                  const success = await login("manager", "manager123")
                  if (!success) setError("Login failed")
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Manager</span>
                  <span className="text-[10px] text-slate-500">manager123</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700"
                disabled={isLoading}
                onClick={async () => {
                  setError("")
                  const success = await login("cashier", "cashier123")
                  if (!success) setError("Login failed")
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Cashier</span>
                  <span className="text-[10px] text-slate-500">cashier123</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
