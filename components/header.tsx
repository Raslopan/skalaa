"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Globe, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SignInDialog, RegisterDialog } from "@/components/auth-dialogs";
import { Logo } from "@/components/logo";

export function Header() {
  const { user, isAuthenticated, isOwner, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-primary shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            {/* Logo */}
            <Logo variant="light" />

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Stays
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Flights
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Car Rentals
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                Attractions
              </Link>
            </nav>

            {/* Right Section */}
            <div className="hidden items-center gap-4 md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>

              {/* Show skeleton/placeholder during SSR and hydration to prevent mismatch */}
              {!mounted || isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="h-9 w-16 animate-pulse rounded-md bg-primary-foreground/10" />
                  <div className="h-9 w-20 animate-pulse rounded-md bg-primary-foreground/10" />
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* Owner Dashboard - Only visible for owners */}
                  {isOwner && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        Owner Dashboard
                      </Button>
                    </Link>
                  )}

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        <User className="h-4 w-4" />
                        {user?.name?.split(" ")[0]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="flex flex-col items-start gap-1">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="#">My Bookings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="#">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setSignInOpen(true)}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
                    onClick={() => setRegisterOpen(true)}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t border-primary-foreground/10 py-4 md:hidden">
              <nav className="flex flex-col gap-3">
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Stays
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Flights
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Car Rentals
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Attractions
                </Link>
                
                {!mounted || isLoading ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="h-9 w-full animate-pulse rounded-md bg-primary-foreground/10" />
                    <div className="h-9 w-full animate-pulse rounded-md bg-primary-foreground/10" />
                  </div>
                ) : isAuthenticated ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    {isOwner && (
                      <Link href="/admin">
                        <Button
                          variant="outline"
                          className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                        >
                          Owner Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSignInOpen(true);
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      className="w-full bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setRegisterOpen(true);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Dialogs */}
      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToSignIn={() => setSignInOpen(true)}
      />
    </>
  );
}
