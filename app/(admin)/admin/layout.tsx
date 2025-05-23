"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingBag, Users, Truck, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You don't have permission to access the admin area.</p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    )
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Shipments",
      href: "/admin/shipments",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
        <div className="flex h-14 items-center px-4 border-b">
          <Link href="/admin" className="flex items-center font-semibold">
            <span className="text-lg font-bold">EcoLog Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:pl-64 w-full">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
          <div className="md:hidden">
            <Link href="/admin" className="flex items-center font-semibold">
              <span className="text-lg font-bold">EcoLog Admin</span>
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Welcome, {user.name}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}
