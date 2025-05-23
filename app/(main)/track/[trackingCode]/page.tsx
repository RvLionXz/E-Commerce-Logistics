"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { shipmentsApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Loader2, ArrowLeft, Package, CheckCircle, Clock, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TrackingPage({ params }: { params: { trackingCode: string } }) {
  const [shipment, setShipment] = useState<any>(null)
  const [traces, setTraces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const trackingCode = params.trackingCode

  useEffect(() => {
    if (!trackingCode) return

    const fetchShipment = async () => {
      setIsLoading(true)
      try {
        const shipmentData = await shipmentsApi.trackShipment(trackingCode)
        const tracesData = await shipmentsApi.getShipmentTraces(trackingCode)

        setShipment(shipmentData)
        setTraces(tracesData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch tracking information",
          variant: "destructive",
        })
        router.push("/track")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShipment()
  }, [trackingCode, toast, router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "paid":
        return <CheckCircle className="h-6 w-6 text-blue-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
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
          <p>Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Tracking information not found</p>
          <Link href="/track" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tracking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link href="/track" className="inline-flex items-center mb-6 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tracking
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tracking: {shipment.tracking_code}</span>
                {getStatusBadge(shipment.order_status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Date:</span>
                  <span>{new Date(shipment.order_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Courier:</span>
                  <span>{shipment.courier_name || "EcoLog Delivery"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID:</span>
                  <span>#{shipment.order_id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
            </CardHeader>
            <CardContent>
              {traces && traces.length > 0 ? (
                <div className="space-y-6">
                  {traces.map((trace, index) => (
                    <div key={trace.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <p className="font-medium">{trace.status}</p>
                          <p className="text-sm text-gray-500">{new Date(trace.updated_at).toLocaleString()}</p>
                        </div>
                        {index < traces.length - 1 && <div className="ml-5 h-12 w-px bg-gray-200 my-2"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No tracking updates yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipment.items &&
                  shipment.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {getStatusIcon(shipment.order_status)}
                  <div>
                    <p className="font-medium">
                      {shipment.order_status === "delivered"
                        ? "Delivered"
                        : shipment.order_status === "shipped"
                          ? "In Transit"
                          : shipment.order_status === "paid"
                            ? "Preparing Shipment"
                            : "Processing Order"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {shipment.order_status === "delivered"
                        ? "Your package has been delivered"
                        : shipment.order_status === "shipped"
                          ? "Your package is on its way"
                          : shipment.order_status === "paid"
                            ? "Your package is being prepared"
                            : "Your order is being processed"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
