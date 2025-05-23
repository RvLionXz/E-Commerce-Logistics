"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cartApi } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Loader2, ShoppingCart, Minus, Plus } from "lucide-react"

interface AddToCartButtonProps {
  productId: number
  disabled?: boolean
}

export function AddToCartButton({ productId, disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to your cart",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      await cartApi.addToCart(productId, quantity)

      toast({
        title: "Added to cart",
        description: `${quantity} item(s) added to your cart`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || disabled || isLoading}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 mx-2 text-center"
          disabled={disabled || isLoading}
        />
        <Button type="button" variant="outline" size="icon" onClick={increaseQuantity} disabled={disabled || isLoading}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleAddToCart} className="w-full" disabled={disabled || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
