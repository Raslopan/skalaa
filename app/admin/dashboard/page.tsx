"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OccupancyOverview } from "@/components/uis/occupancy-overview";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Bell,
  Loader2,
} from "lucide-react";
import type { Property, Reservation } from "@/lib/queries";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [todayStr, setTodayStr] = useState("");

  const { data: properties, isLoading: propertiesLoading } = useSWR<Property[]>("/api/properties", fetcher);
  const { data: reservations, isLoading: reservationsLoading } = useSWR<Reservation[]>("/api/reservations", fetcher);

  useEffect(() => {
    setMounted(true);
    setTodayStr(format(new Date(), "MMM d, yyyy"));
  }, []);

  const confirmedReservations = (reservations || []).filter(
    (r) => r.status === "confirmed"
  );
  const pendingReservations = (reservations || []).filter((r) => r.status === "pending");
  const totalRevenue = confirmedReservations.reduce(
    (sum, r) => sum + Number(r.total_price),
    0
  );

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      message: "New booking received",
      property: "Seaside Luxury Apartment",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "checkin",
      message: "Guest checked in",
      property: "Mountain View Villa",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review",
      property: "Downtown Studio Loft",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "checkout",
      message: "Guest checked out",
      property: "Beachfront House",
      time: "2 days ago",
    },
  ];

  if (!mounted || propertiesLoading || reservationsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your properties.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          Last updated: {todayStr}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Properties</CardDescription>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{properties?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Active Bookings</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {confirmedReservations.length}
            </div>
            <div className="flex items-center text-xs">
              <Badge variant="secondary" className="mr-1">
                {pendingReservations.length} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Monthly Revenue</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Occupancy Rate</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72%</div>
            <div className="flex items-center text-xs text-rose-600">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              -3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Overview */}
      <div className="mb-8">
        <OccupancyOverview />
      </div>

      {/* Properties and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>Quick overview of all your listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(properties || []).map((property) => {
              const propertyReservations = (reservations || []).filter(
                (r) => r.property_id === property.id && r.status === "confirmed"
              );
              return (
                <div
                  key={property.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <img
                    src={property.image}
                    alt={property.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{property.name}</h4>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        {property.max_guests}
                      </Badge>
                      <Badge variant="outline">
                        {propertyReservations.length} bookings
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${property.price_per_night}
                    </p>
                    <p className="text-xs text-muted-foreground">/night</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your properties</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    activity.type === "booking"
                      ? "bg-emerald-100 text-emerald-600"
                      : activity.type === "checkin"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "review"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {activity.type === "booking" && (
                    <Calendar className="h-5 w-5" />
                  )}
                  {activity.type === "checkin" && <Users className="h-5 w-5" />}
                  {activity.type === "review" && (
                    <TrendingUp className="h-5 w-5" />
                  )}
                  {activity.type === "checkout" && <Users className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.property}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Check-ins */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Check-ins</CardTitle>
          <CardDescription>Guests arriving in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Property</th>
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Check-out</th>
                  <th className="pb-3 font-medium">Guests</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {confirmedReservations.slice(0, 4).map((reservation) => {
                  const property = (properties || []).find(
                    (p) => p.id === reservation.property_id
                  );
                  return (
                    <tr key={reservation.id} className="border-b">
                      <td className="py-3">
                        <p className="font-medium">{reservation.guest_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.guest_email}
                        </p>
                      </td>
                      <td className="py-3">{property?.name || "Unknown"}</td>
                      <td className="py-3">
                        {format(new Date(reservation.check_in), "MMM d, yyyy")}
                      </td>
                      <td className="py-3">
                        {format(new Date(reservation.check_out), "MMM d, yyyy")}
                      </td>
                      <td className="py-3">{reservation.guests}</td>
                      <td className="py-3 text-right font-bold">
                        ${reservation.total_price}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
