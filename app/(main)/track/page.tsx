"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search } from "lucide-react"

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    router.push(`/track/${trackingCode}`)
  }

  return (
    <div className="container py-10 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Track Your Order</CardTitle>
          <CardDescription className="text-center">
            Enter your tracking code to see the status of your shipment
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter tracking code (e.g., RESI-ABC123)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Shipment
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
