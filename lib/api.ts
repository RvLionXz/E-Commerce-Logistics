const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://47.250.187.233:4000/api"

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  console.log(`Fetching ${url}`, options)

  // Get auth token from localStorage if available
  let headers: HeadersInit = {
    ...options.headers,
    "Content-Type": "application/json",
  }

  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user && user.id) {
          headers = {
            ...headers,
            "user-id": user.id.toString(),
          }
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error)
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies in the request
    })

    console.log(`Response status: ${response.status}`)

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
      console.log("Response data:", data)
    } else {
      return response
    }

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Auth API calls
export const authApi = {
  register: async (userData: any) => {
    return fetchApi("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: any) => {
    try {
      const data = await fetchApi("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      // Ensure we have the expected data structure
      if (!data || typeof data !== "object" || !data.id) {
        console.error("Invalid login response:", data)
        throw new Error("Invalid response from server")
      }

      // Set a cookie to indicate the user is logged in
      // This is used by the middleware
      document.cookie = `user=true; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

      return data
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  },

  getProfile: async () => {
    return fetchApi("/users/profile")
  },

  updateProfile: async (userData: any) => {
    return fetchApi("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  checkAdmin: async () => {
    return fetchApi("/admin/status")
  },
}

// Products API calls
export const productsApi = {
  getAll: async () => {
    return fetchApi("/products")
  },

  getById: async (id: string) => {
    return fetchApi(`/products/${id}`)
  },

  create: async (productData: any) => {
    return fetchApi("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
  },

  update: async (id: string, productData: any) => {
    return fetchApi(`/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
  },

  delete: async (id: string) => {
    return fetchApi(`/products/${id}`, {
      method: "DELETE",
    })
  },
}

// Cart API calls
export const cartApi = {
  getCart: async () => {
    return fetchApi("/cart")
  },

  addToCart: async (productId: number, quantity: number) => {
    return fetchApi("/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    })
  },

  updateCartItem: async (id: number, quantity: number) => {
    return fetchApi(`/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })
  },

  removeFromCart: async (id: number) => {
    return fetchApi(`/cart/${id}`, {
      method: "DELETE",
    })
  },

  clearCart: async () => {
    return fetchApi("/cart", {
      method: "DELETE",
    })
  },
}

// Orders API calls
export const ordersApi = {
  createOrder: async () => {
    return fetchApi("/orders", {
      method: "POST",
    })
  },

  getUserOrders: async () => {
    return fetchApi("/orders/user")
  },

  getOrderById: async (id: string) => {
    return fetchApi(`/orders/${id}`)
  },

  getAllOrders: async () => {
    return fetchApi("/orders")
  },

  updateOrderStatus: async (id: string, status: string) => {
    return fetchApi(`/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  },
}

// Shipments API calls
export const shipmentsApi = {
  trackShipment: async (trackingCode: string) => {
    return fetchApi(`/shipments/track/${trackingCode}`)
  },

  getShipmentTraces: async (trackingCode: string) => {
    return fetchApi(`/shipments/track/${trackingCode}/traces`)
  },

  getAllShipments: async () => {
    return fetchApi("/shipments")
  },

  createShipmentTrace: async (id: string, status: string) => {
    return fetchApi(`/shipments/${id}/trace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  },
}

// Admin API calls
export const adminApi = {
  getDashboardStats: async () => {
    return fetchApi("/admin/dashboard")
  },
}
