"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { shipmentsApi } from "@/lib/api"
import { Loader2, Search, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    setIsLoading(true)
    try {
      const data = await shipmentsApi.getAllShipments()
      setShipments(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shipments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTrace = async () => {
    if (!selectedShipment || !newStatus.trim()) return

    setIsSubmitting(true)
    try {
      await shipmentsApi.createShipmentTrace(selectedShipment.id.toString(), newStatus)
      await fetchShipments()

      setNewStatus("")
      setSelectedShipment(null)

      toast({
        title: "Success",
        description: "Shipment trace added successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add shipment trace",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  const filteredShipments = shipments.filter((shipment) => {
    return (
      shipment.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.order_id.toString().includes(searchTerm) ||
      shipment.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading shipments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shipments</h1>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by tracking code or customer..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking Code</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">
                    <Link href={`/track/${shipment.tracking_code}`} target="_blank" className="hover:underline">
                      {shipment.tracking_code}
                    </Link>
                  </TableCell>
                  <TableCell>#{shipment.order_id}</TableCell>
                  <TableCell>{shipment.user_name}</TableCell>
                  <TableCell>{new Date(shipment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(shipment.order_status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedShipment(shipment)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Shipment Update</DialogTitle>
                          <DialogDescription>
                            Add a new status update for tracking code: {selectedShipment?.tracking_code}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="status">Status Update</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Order received">Order received</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Packed">Packed</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="In transit">In transit</SelectItem>
                                <SelectItem value="Out for delivery">Out for delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddTrace} disabled={isSubmitting || !newStatus}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add Update"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
