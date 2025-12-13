"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, User, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:flex-1">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-8 w-8">
              <rect width="32" height="32" rx="6" fill="currentColor" className="text-primary"/>
              <path d="M6 22L11 17L16 19L26 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M26 9L22 9L22 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="6" cy="22" r="2" fill="white"/>
              <circle cx="11" cy="17" r="2" fill="white"/>
              <circle cx="16" cy="19" r="2" fill="white"/>
              <circle cx="26" cy="9" r="2" fill="white"/>
            </svg>
            <span className="text-xl font-bold">CuantoValeHoy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Calculadora
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Acerca de
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:flex-1 md:justify-end">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col gap-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculadora
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

