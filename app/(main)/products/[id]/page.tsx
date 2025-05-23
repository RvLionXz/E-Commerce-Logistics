import { notFound } from "next/navigation"
import Image from "next/image"
import { productsApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getProduct(id: string) {
  try {
    return await productsApi.getById(id)
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error)
    return null
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-10">
      <Link href="/" className="inline-flex items-center mb-6 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image_url || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold mt-4 text-primary">{formatCurrency(product.price)}</p>

          <div className="mt-4 text-gray-500">
            <p>{product.description}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm">
              Availability:{" "}
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </p>
          </div>

          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="container py-10">
      <div className="inline-flex items-center mb-6 text-sm text-gray-500">
        <Skeleton className="h-4 w-4 mr-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />

        <div className="flex flex-col">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/4 mb-6" />

          <Skeleton className="h-20 w-full mb-4" />

          <Skeleton className="h-4 w-1/3 mb-8" />

          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
