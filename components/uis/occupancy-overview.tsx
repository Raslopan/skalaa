"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { properties, generateCalendarData, reservations } from "@/lib/mock-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function OccupancyOverview() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  const calendarDataByProperty = useMemo(() => {
    if (!currentDate) return {};
    const data: Record<string, ReturnType<typeof generateCalendarData>> = {};
    properties.forEach((property) => {
      data[property.id] = generateCalendarData(
        property.id,
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
    });
    return data;
  }, [currentDate]);

  const goToPreviousMonth = () => {
    if (!currentDate) return;
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    if (!currentDate) return;
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500";
      case "occupied":
        return "bg-rose-500";
      case "maintenance":
        return "bg-amber-500";
      case "blocked":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getReservationInfo = (reservationId?: string) => {
    if (!reservationId) return null;
    return reservations.find((r) => r.id === reservationId);
  };

  const calculateOccupancyRate = (propertyId: string) => {
    const data = calendarDataByProperty[propertyId];
    if (!data) return 0;
    const occupiedDays = data.filter((d) => d.status === "occupied").length;
    return Math.round((occupiedDays / data.length) * 100);
  };

  // Generate array of day numbers for the month
  const daysInMonth = currentDate
    ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    : 31;

  if (!mounted || !currentDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Overview...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>
              Visual overview of all properties for the month
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <span className="min-w-[140px] text-center font-medium">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-rose-500" />
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-amber-500" />
            <span className="text-sm text-muted-foreground">Maintenance</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day headers */}
            <div className="mb-2 flex">
              <div className="w-48 shrink-0 pr-4 text-sm font-medium">
                Property
              </div>
              <div className="flex flex-1 gap-0.5">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="w-16 shrink-0 pl-2 text-center text-xs font-medium">
                Rate
              </div>
            </div>

            {/* Property rows */}
            <TooltipProvider>
              {properties.map((property) => {
                const data = calendarDataByProperty[property.id] || [];
                const occupancyRate = calculateOccupancyRate(property.id);

                return (
                  <div
                    key={property.id}
                    className="mb-2 flex items-center rounded-lg bg-muted/30 p-2"
                  >
                    <div className="w-48 shrink-0 pr-4">
                      <p className="truncate text-sm font-medium">
                        {property.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {property.location}
                      </p>
                    </div>
                    <div className="flex flex-1 gap-0.5">
                      {data.map((day, index) => {
                        const reservation = getReservationInfo(day.reservationId);
                        return (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "h-8 flex-1 cursor-pointer rounded-sm transition-opacity hover:opacity-80",
                                  getStatusColor(day.status)
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {day.date.toLocaleDateString()}
                                </p>
                                <p className="capitalize">{day.status}</p>
                                {reservation && (
                                  <p className="text-muted-foreground">
                                    Guest: {reservation.guestName}
                                  </p>
                                )}
                                {day.price && (
                                  <p className="text-muted-foreground">
                                    ${day.price}/night
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                    <div className="w-16 shrink-0 pl-2 text-center">
                      <Badge
                        variant={occupancyRate > 50 ? "default" : "secondary"}
                        className={cn(
                          occupancyRate > 70 && "bg-emerald-500 hover:bg-emerald-600",
                          occupancyRate < 30 && "bg-rose-500 hover:bg-rose-600 text-white"
                        )}
                      >
                        {occupancyRate}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </TooltipProvider>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-600">Total Available Days</p>
            <p className="text-2xl font-bold text-emerald-700">
              {Object.values(calendarDataByProperty)
                .flat()
                .filter((d) => d.status === "available").length}
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 p-4">
            <p className="text-sm text-rose-600">Total Booked Days</p>
            <p className="text-2xl font-bold text-rose-700">
              {Object.values(calendarDataByProperty)
                .flat()
                .filter((d) => d.status === "occupied").length}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm text-amber-600">Maintenance Days</p>
            <p className="text-2xl font-bold text-amber-700">
              {Object.values(calendarDataByProperty)
                .flat()
                .filter((d) => d.status === "maintenance").length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
