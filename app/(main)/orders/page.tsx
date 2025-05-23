"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ordersApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Package, ExternalLink, ShoppingBag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const data = await ordersApi.getUserOrders()
      setOrders(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Paid
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">No Orders Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">You haven't placed any orders yet.</p>
          </CardContent>
          <div className="flex justify-center p-6 pt-0">
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{order.total_amount ? formatCurrency(order.total_amount) : "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {order.tracking_code ? (
                      <Link href={`/track/${order.tracking_code}`}>
                        <Button variant="outline" size="sm">
                          <Package className="h-4 w-4 mr-2" />
                          {order.tracking_code}
                        </Button>
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
