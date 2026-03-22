"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  properties,
  generateCalendarData,
  type CalendarDay,
  type Property,
} from "@/lib/mock-data";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface AvailabilityCalendarProps {
  propertyId?: string;
  onDateSelect?: (date: Date, status: CalendarDay["status"]) => void;
  selectionMode?: "single" | "range";
}

export function AvailabilityCalendar({
  propertyId,
  onDateSelect,
  selectionMode = "single",
}: AvailabilityCalendarProps) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>(
    propertyId || properties[0].id
  );
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  const calendarData = useMemo(() => {
    if (!currentDate) return [];
    return generateCalendarData(
      selectedProperty,
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
  }, [selectedProperty, currentDate]);

  const property = properties.find((p) => p.id === selectedProperty);

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

  const handleDateClick = (day: CalendarDay) => {
    if (day.status !== "available") return;

    if (selectionMode === "range") {
      if (!selectedRange.start || selectedRange.end) {
        setSelectedRange({ start: day.date, end: null });
      } else {
        if (day.date > selectedRange.start) {
          setSelectedRange({ ...selectedRange, end: day.date });
        } else {
          setSelectedRange({ start: day.date, end: null });
        }
      }
    }

    onDateSelect?.(day.date, day.status);
  };

  const isInSelectedRange = (date: Date) => {
    if (!selectedRange.start) return false;
    if (!selectedRange.end) return date.getTime() === selectedRange.start.getTime();
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const getStatusColor = (status: CalendarDay["status"], isSelected: boolean) => {
    if (isSelected) return "bg-primary text-primary-foreground";
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer";
      case "occupied":
        return "bg-rose-100 text-rose-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "blocked":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  // Get the first day of the month and padding days
  const firstDayOfMonth = currentDate
    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    : 0;
  const paddingDays = Array(firstDayOfMonth).fill(null);

  if (!mounted || !currentDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Calendar...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Availability Calendar</CardTitle>
          {!propertyId && (
            <Select
              value={selectedProperty}
              onValueChange={setSelectedProperty}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <h3 className="text-lg font-semibold">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>

        {/* Property Info */}
        {property && (
          <div className="mb-4 rounded-lg bg-muted/50 p-3">
            <p className="font-medium">{property.name}</p>
            <p className="text-sm text-muted-foreground">
              {property.location} | ${property.pricePerNight}/night | Up to{" "}
              {property.maxGuests} guests
            </p>
          </div>
        )}

        {/* Days of Week Header */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding for first week */}
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="aspect-square p-1" />
          ))}

          {/* Calendar Days */}
          {calendarData.map((day, index) => {
            const isSelected = isInSelectedRange(day.date);
            const isToday = currentDate
              ? day.date.toDateString() === currentDate.toDateString()
              : false;

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-sm transition-colors",
                  getStatusColor(day.status, isSelected),
                  isToday && "ring-2 ring-primary ring-offset-1"
                )}
              >
                <span className="font-medium">{day.date.getDate()}</span>
                {day.price && (
                  <span className="text-[10px] opacity-75">${day.price}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-emerald-100" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-rose-100" />
            <span className="text-sm text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-amber-100" />
            <span className="text-sm text-muted-foreground">Maintenance</span>
          </div>
        </div>

        {/* Selected Range Info */}
        {selectionMode === "range" && selectedRange.start && (
          <div className="mt-4 rounded-lg bg-primary/10 p-3">
            <p className="text-sm font-medium">Selected Dates:</p>
            <p className="text-sm text-muted-foreground">
              {selectedRange.start.toLocaleDateString()}
              {selectedRange.end &&
                ` - ${selectedRange.end.toLocaleDateString()}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
