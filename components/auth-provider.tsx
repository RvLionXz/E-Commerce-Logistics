"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuthStatus: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus()
      setLoading(false)
    }

    checkAuth()
  }, [])

  // This useEffect is causing issues - let's simplify it
  useEffect(() => {
    if (loading) return

    // Only redirect if not logged in and trying to access protected routes
    if (!user && pathname && !isPublicPath(pathname)) {
      console.log("Redirecting to login because user is not authenticated and path is protected:", pathname)
      router.push("/auth/login")
    }
  }, [user, loading, pathname, router])

  // Helper function to check if a path is public
  const isPublicPath = (path: string) => {
    const publicPaths = ["/", "/auth/login", "/auth/register", "/track"]
    return publicPaths.includes(path) || path.startsWith("/track/") || path.startsWith("/products/")
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false

      const storedUser = localStorage.getItem("user")
      if (!storedUser) return false

      let userData
      try {
        userData = JSON.parse(storedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        setUser(null)
        return false
      }

      // Set the user from localStorage first
      setUser(userData)

      // Verify the user is still valid by fetching profile
      try {
        await authApi.getProfile()
      } catch (error) {
        console.error("Profile verification failed:", error)
        localStorage.removeItem("user")
        setUser(null)
        return false
      }

      // Check if user is admin
      let isAdmin = userData.isAdmin
      if (userData.id) {
        try {
          const { isAdmin: adminStatus } = await authApi.checkAdmin()
          isAdmin = adminStatus
        } catch (error) {
          console.error("Error checking admin status:", error)
        }
      }

      setUser({
        ...userData,
        isAdmin,
      })

      return true
    } catch (error) {
      console.error("Auth check failed:", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
      setUser(null)
      return false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userData = await authApi.login({ email, password })

      console.log("Login response:", userData)

      if (!userData || !userData.id) {
        throw new Error("Invalid response from server")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Update state
      setUser(userData)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Use window.location for a hard redirect instead of Next.js router
      // This ensures a complete page reload which can help with state issues
      window.location.href = userData.isAdmin ? "/admin" : "/"
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      await authApi.register({ name, email, password })

      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      })

      router.push("/auth/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)

    // Use window.location for a hard redirect
    window.location.href = "/"

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
