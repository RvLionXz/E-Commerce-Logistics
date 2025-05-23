import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go back home</Button>
      </Link>
    </div>
  )
}
