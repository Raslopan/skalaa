"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { Building2, Search, Loader2 } from "lucide-react";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

export function SignInDialog({ open, onOpenChange, onSwitchToRegister }: SignInDialogProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      onOpenChange(false);
      setEmail("");
      setPassword("");
    } else {
      setError(result.error || "Sign in failed");
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome back</DialogTitle>
          <DialogDescription>
            Sign in to your StayHub account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => {
                onOpenChange(false);
                onSwitchToRegister();
              }}
            >
              Register
            </button>
          </p>
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo accounts:</p>
            <p>Owner: owner@example.com / owner123</p>
            <p>Guest: guest@example.com / guest123</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn: () => void;
}

export function RegisterDialog({ open, onOpenChange, onSwitchToSignIn }: RegisterDialogProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("guest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await register(email, password, name, role);
    
    if (result.success) {
      onOpenChange(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("guest");
    } else {
      setError(result.error || "Registration failed");
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create an account</DialogTitle>
          <DialogDescription>
            Join StayHub to book or list accommodations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>I want to...</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <RadioGroupItem
                  value="guest"
                  id="guest"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="guest"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-transparent p-4 transition-all hover:bg-secondary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <Search className="h-6 w-6 text-primary" />
                  <span className="font-medium">Book stays</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Find and book accommodations
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="owner"
                  id="owner"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="owner"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-transparent p-4 transition-all hover:bg-secondary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-medium">List property</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Manage your properties
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => {
                onOpenChange(false);
                onSwitchToSignIn();
              }}
            >
              Sign in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
