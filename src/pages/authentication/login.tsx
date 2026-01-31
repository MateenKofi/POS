"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/custom-components"
import { User, Lock, Eye, EyeOff, Loader2, Sparkles, Leaf, Store } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

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

  const quickLogin = async (role: string, username: string, password: string) => {
    setError("")
    const success = await login(username, password)
    if (!success) {
      setError(`${role} login failed`)
    } else {
      toast.success(`Logged in as ${role}`)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-300/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AGRI-FEEDS POS</span>
          </div>
          <p className="text-emerald-100 text-lg max-w-md">
            Streamline your agricultural sales operations with our modern point-of-sale system.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 text-white/90">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Inventory Management</p>
              <p className="text-sm text-emerald-200">Track stock in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Smart Analytics</p>
              <p className="text-sm text-emerald-200">Data-driven insights</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-emerald-200 text-sm">
          © 2025 Agri-Feeds POS. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AGRI-FEEDS POS</span>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to access your dashboard</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    {...register("username", { required: "Username is required" })}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 h-12 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <Leaf className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-400">Quick Login (Demo)</span>
              </div>
            </div>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => quickLogin("Admin", "admin", "admin123")}
                className="group relative p-4 rounded-xl border-2 border-red-100 hover:border-red-300 hover:bg-red-50 transition-all"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center mb-2 transition-colors">
                    <User className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Admin</span>
                  <span className="text-[10px] text-slate-400">Full Access</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => quickLogin("Manager", "manager", "manager123")}
                className="group relative p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mb-2 transition-colors">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Manager</span>
                  <span className="text-[10px] text-slate-400">Manage</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => quickLogin("Cashier", "cashier", "cashier123")}
                className="group relative p-4 rounded-xl border-2 border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-all"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center mb-2 transition-colors">
                    <User className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Cashier</span>
                  <span className="text-[10px] text-slate-400">Sales</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Secure login • Role-based access • Real-time sync
          </p>
        </div>
      </div>
    </div>
  )
}

export { Login }
