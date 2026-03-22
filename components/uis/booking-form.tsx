"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { properties, type Property } from "@/lib/mock-data";
import {
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Users,
  Bed,
  Bath,
} from "lucide-react";

interface BookingFormProps {
  preselectedProperty?: string;
  preselectedDates?: { start: Date; end: Date };
  onComplete?: (booking: BookingData) => void;
}

interface BookingData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  agreeToTerms: boolean;
}

const STEPS = [
  { id: 1, title: "Property & Dates", icon: Calendar },
  { id: 2, title: "Guest Details", icon: User },
  { id: 3, title: "Review & Confirm", icon: CreditCard },
  { id: 4, title: "Confirmation", icon: CheckCircle },
];

export function BookingForm({
  preselectedProperty,
  preselectedDates,
  onComplete,
}: BookingFormProps) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [formData, setFormData] = useState<BookingData>({
    propertyId: preselectedProperty || "",
    checkIn: preselectedDates?.start.toISOString().split("T")[0] || "",
    checkOut: preselectedDates?.end.toISOString().split("T")[0] || "",
    guests: 1,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    setMounted(true);
    // Set default dates on client to avoid hydration mismatch
    if (!preselectedDates) {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const weekAfter = new Date(today);
      weekAfter.setDate(today.getDate() + 10);

      setFormData((prev) => ({
        ...prev,
        checkIn: nextWeek.toISOString().split("T")[0],
        checkOut: weekAfter.toISOString().split("T")[0],
      }));
    }
  }, [preselectedDates]);

  const selectedProperty = properties.find((p) => p.id === formData.propertyId);

  const calculateTotalPrice = () => {
    if (!selectedProperty || !formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights * selectedProperty.pricePerNight;
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const updateFormData = (field: keyof BookingData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyId && formData.checkIn && formData.checkOut && formData.guests > 0;
      case 2:
        return formData.guestName && formData.guestEmail && formData.guestPhone;
      case 3:
        return formData.agreeToTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 3) {
      setConfirmationNumber(`SH-${Date.now().toString(36).toUpperCase()}`);
      onComplete?.(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Booking Form...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <CardDescription>Complete your reservation in a few simple steps</CardDescription>
        
        {/* Progress Steps */}
        <div className="mt-4 flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-emerald-500 bg-emerald-500 text-white",
                      !isActive && !isCompleted && "border-muted-foreground/30"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 hidden text-xs sm:block",
                      isActive && "font-medium text-foreground",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-8 sm:w-16 lg:w-24",
                      isCompleted ? "bg-emerald-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {/* Step 1: Property & Dates */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="property">Select Property</Label>
              <Select
                value={formData.propertyId}
                onValueChange={(value) => updateFormData("propertyId", value)}
              >
                <SelectTrigger id="property">
                  <SelectValue placeholder="Choose a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - ${p.pricePerNight}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.name}
                    className="h-32 w-full rounded-lg object-cover sm:w-48"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{selectedProperty.name}</h4>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {selectedProperty.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        {selectedProperty.maxGuests} guests
                      </Badge>
                      <Badge variant="secondary">
                        <Bed className="mr-1 h-3 w-3" />
                        {selectedProperty.bedrooms} beds
                      </Badge>
                      <Badge variant="secondary">
                        <Bath className="mr-1 h-3 w-3" />
                        {selectedProperty.bathrooms} baths
                      </Badge>
                    </div>
                    <p className="mt-2 text-lg font-bold text-primary">
                      ${selectedProperty.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => updateFormData("checkIn", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => updateFormData("checkOut", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => updateFormData("guests", parseInt(value))}
              >
                <SelectTrigger id="guests">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: selectedProperty?.maxGuests || 4 },
                    (_, i) => i + 1
                  ).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name</Label>
              <Input
                id="guestName"
                placeholder="Enter your full name"
                value={formData.guestName}
                onChange={(e) => updateFormData("guestName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email Address</Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.guestEmail}
                onChange={(e) => updateFormData("guestEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone Number</Label>
              <Input
                id="guestPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.guestPhone}
                onChange={(e) => updateFormData("guestPhone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <textarea
                id="specialRequests"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Any special requests or requirements..."
                value={formData.specialRequests}
                onChange={(e) => updateFormData("specialRequests", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && selectedProperty && (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="mb-4 font-semibold">Booking Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium">{selectedProperty.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{selectedProperty.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span>{new Date(formData.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span>{new Date(formData.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span>{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${selectedProperty.pricePerNight} x {calculateNights()} nights
                    </span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Guest Information</h4>
              <p>{formData.guestName}</p>
              <p className="text-muted-foreground">{formData.guestEmail}</p>
              <p className="text-muted-foreground">{formData.guestPhone}</p>
              {formData.specialRequests && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm text-muted-foreground">Special Requests:</p>
                  <p className="text-sm">{formData.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  updateFormData("agreeToTerms", checked === true)
                }
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed text-muted-foreground"
              >
                I agree to the terms and conditions, cancellation policy, and house
                rules for this property.
              </Label>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Booking Confirmed!</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Your reservation has been successfully submitted. A confirmation email
              has been sent to {formData.guestEmail}.
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Confirmation Number</p>
              <p className="text-2xl font-bold tracking-wider">
                {confirmationNumber}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {currentStep > 1 && currentStep < 4 && (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {currentStep === 1 && <div />}
        {currentStep < 4 && (
          <Button onClick={handleNext} disabled={!canProceed()} className="ml-auto">
            {currentStep === 3 ? "Confirm Booking" : "Continue"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {currentStep === 4 && (
          <Button onClick={() => setCurrentStep(1)} className="mx-auto">
            Make Another Booking
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
