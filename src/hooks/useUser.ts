import { useState, useEffect } from "react"

export interface User {
  username: string
  role: "manager" | "cashier"
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return user
}
