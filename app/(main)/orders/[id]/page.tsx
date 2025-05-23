"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ordersApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Loader2, ArrowLeft, Package } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    fetchOrder()
  }, [user, router, params.id])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const data = await ordersApi.getOrderById(params.id)
      setOrder(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch order details",
        variant: "destructive",
      })
      router.push("/orders")
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
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link href="/orders" className="inline-flex items-center mb-6 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to orders
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id}</span>
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tracking Code:</span>
                  <Link href={`/track/${order.tracking_code}`} className="text-primary hover:underline">
                    {order.tracking_code}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={item.image_url || "/placeholder.svg?height=50&width=50"}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number.parseFloat(item.price) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {order.shipmentTraces && order.shipmentTraces.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.shipmentTraces.map((trace: any) => (
                    <div key={trace.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{trace.status}</p>
                        <p className="text-sm text-gray-500">{new Date(trace.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total_amount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Link href={`/track/${order.tracking_code}`}>
              <Button className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Track Shipment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
