"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailabilityCalendar } from "@/components/uis/availability-calendar";
import { BookingForm } from "@/components/uis/booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reservations, properties } from "@/lib/mock-data";
import { format } from "date-fns";
import { Calendar, Plus, List } from "lucide-react";

export default function ReservationsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPropertyName = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!mounted) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Online Reservations</h1>
        <p className="text-muted-foreground">
          Manage availability and bookings for your properties
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Booking</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">All Bookings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <AvailabilityCalendar selectionMode="range" />
        </TabsContent>

        <TabsContent value="booking">
          <div className="mx-auto max-w-2xl">
            <BookingForm />
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>
                View and manage all bookings across your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{reservation.guestName}</p>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getPropertyName(reservation.propertyId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(reservation.checkIn, "MMM d, yyyy")} -{" "}
                        {format(reservation.checkOut, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${reservation.totalPrice}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.guests} guests
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
