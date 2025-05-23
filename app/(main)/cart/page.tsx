"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { cartApi, ordersApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Trash2, ShoppingCart, ArrowRight } from "lucide-react"

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    fetchCart()
  }, [user, router])

  const fetchCart = async () => {
    setIsLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return

    setIsUpdating(true)
    try {
      await cartApi.updateCartItem(id, quantity)
      await fetchCart()
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveItem = async (id: number) => {
    setIsUpdating(true)
    try {
      await cartApi.removeFromCart(id)
      await fetchCart()
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const result = await ordersApi.createOrder()
      toast({
        title: "Order placed",
        description: `Your order has been placed successfully. Tracking code: ${result.trackingCode}`,
      })
      router.push(`/orders`)
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-24">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=100&width=100"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value)
                            if (!isNaN(val) && val > 0) {
                              handleUpdateQuantity(item.id, val)
                            }
                          }}
                          className="w-14 h-8 mx-2 text-center"
                          disabled={isUpdating}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                        >
                          +
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <span>{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
