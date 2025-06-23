"use client"
import SidebarLayout from "@/components/sidebar-layout"
import type React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UserMenu } from "@/components/user-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarLayout>
      {/* Botón para abrir el sidebar en móvil */}
      <div className="md:hidden p-2">
        <SidebarTrigger />
      </div>
      {children}
    </SidebarLayout>
  )
}
