import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { productsApi } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Truck, ShoppingBag, CreditCard } from "lucide-react"

async function getProducts() {
  try {
    return await productsApi.getAll()
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Shop Smart, Track Better
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Your one-stop shop for fashion and accessories with real-time delivery tracking.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="#featured-products">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/track">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white">
                    Track Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Hero Image"
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose EcoLog?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We combine quality products with cutting-edge logistics for a seamless shopping experience.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <ShoppingBag className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-bold">Quality Products</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Curated selection of high-quality fashion and accessories.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Truck className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-bold">Real-time Tracking</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your orders in real-time with our advanced logistics system.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <CreditCard className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-bold">Secure Checkout</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Safe and secure payment processing for worry-free shopping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Explore our latest collection of trending products.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products.map((product:any) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 h-10">{product.description}</p>
                  <p className="font-bold text-lg mt-2">{formatCurrency(product.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Link href={`/products/${product.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Tracking Illustration"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Track Your Order</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Know exactly where your package is with our real-time tracking system.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/track">
                  <Button size="lg">Track Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
