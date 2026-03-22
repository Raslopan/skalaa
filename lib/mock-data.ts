// Mock data for the UIS (Unified Information System)

export interface Property {
  id: string;
  name: string;
  type: "apartment" | "house" | "villa" | "studio";
  location: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
}

export interface CalendarDay {
  date: Date;
  status: "available" | "occupied" | "maintenance" | "blocked";
  reservationId?: string;
  price?: number;
}

export const properties: Property[] = [
  {
    id: "prop-1",
    name: "Seaside Luxury Apartment",
    type: "apartment",
    location: "Miami Beach, FL",
    pricePerNight: 250,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Pool", "Kitchen", "AC", "Parking"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
  },
  {
    id: "prop-2",
    name: "Mountain View Villa",
    type: "villa",
    location: "Aspen, CO",
    pricePerNight: 450,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["WiFi", "Hot Tub", "Fireplace", "Kitchen", "Ski Storage"],
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop",
  },
  {
    id: "prop-3",
    name: "Downtown Studio Loft",
    type: "studio",
    location: "New York, NY",
    pricePerNight: 180,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Gym", "Doorman", "Washer/Dryer"],
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
  },
  {
    id: "prop-4",
    name: "Beachfront House",
    type: "house",
    location: "Malibu, CA",
    pricePerNight: 650,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["WiFi", "Beach Access", "BBQ", "Patio", "Kitchen"],
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop",
  },
];

export const reservations: Reservation[] = [
  {
    id: "res-1",
    propertyId: "prop-1",
    guestName: "John Smith",
    guestEmail: "john@example.com",
    checkIn: new Date(2026, 2, 15),
    checkOut: new Date(2026, 2, 20),
    guests: 2,
    totalPrice: 1250,
    status: "confirmed",
    createdAt: new Date(2026, 2, 1),
  },
  {
    id: "res-2",
    propertyId: "prop-1",
    guestName: "Jane Doe",
    guestEmail: "jane@example.com",
    checkIn: new Date(2026, 2, 22),
    checkOut: new Date(2026, 2, 25),
    guests: 4,
    totalPrice: 750,
    status: "confirmed",
    createdAt: new Date(2026, 2, 5),
  },
  {
    id: "res-3",
    propertyId: "prop-2",
    guestName: "Mike Johnson",
    guestEmail: "mike@example.com",
    checkIn: new Date(2026, 2, 18),
    checkOut: new Date(2026, 2, 24),
    guests: 6,
    totalPrice: 2700,
    status: "pending",
    createdAt: new Date(2026, 2, 10),
  },
  {
    id: "res-4",
    propertyId: "prop-3",
    guestName: "Sarah Wilson",
    guestEmail: "sarah@example.com",
    checkIn: new Date(2026, 2, 16),
    checkOut: new Date(2026, 2, 19),
    guests: 2,
    totalPrice: 540,
    status: "confirmed",
    createdAt: new Date(2026, 2, 8),
  },
  {
    id: "res-5",
    propertyId: "prop-4",
    guestName: "Robert Brown",
    guestEmail: "robert@example.com",
    checkIn: new Date(2026, 2, 20),
    checkOut: new Date(2026, 2, 27),
    guests: 5,
    totalPrice: 4550,
    status: "confirmed",
    createdAt: new Date(2026, 2, 12),
  },
];

// Generate calendar data for a property
export function generateCalendarData(
  propertyId: string,
  year: number,
  month: number
): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const propertyReservations = reservations.filter(
    (r) => r.propertyId === propertyId && r.status !== "cancelled"
  );
  const property = properties.find((p) => p.id === propertyId);
  const basePrice = property?.pricePerNight || 100;

  const calendarDays: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    let status: CalendarDay["status"] = "available";
    let reservationId: string | undefined;

    // Check if date falls within any reservation
    for (const reservation of propertyReservations) {
      if (date >= reservation.checkIn && date < reservation.checkOut) {
        status = "occupied";
        reservationId = reservation.id;
        break;
      }
    }

    // Add some maintenance days (e.g., last day of month for prop-1)
    if (propertyId === "prop-1" && day >= 28) {
      status = "maintenance";
    }

    // Weekend price adjustment
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const price = isWeekend ? Math.round(basePrice * 1.2) : basePrice;

    calendarDays.push({
      date,
      status,
      reservationId,
      price: status === "available" ? price : undefined,
    });
  }

  return calendarDays;
}

// Module definitions for the modular system
export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  route: string;
}

export const modules: Module[] = [
  {
    id: "dashboard",
    name: "Owner Dashboard",
    description: "Property overview and analytics",
    icon: "LayoutDashboard",
    enabled: true,
    route: "/admin/dashboard",
  },
  {
    id: "properties",
    name: "Property Management",
    description: "Add, edit and manage listings",
    icon: "Building2",
    enabled: true,
    route: "/admin/properties",
  },
  {
    id: "reservations",
    name: "Manual Booking",
    description: "Create bookings for guests",
    icon: "Calendar",
    enabled: true,
    route: "/admin/reservations",
  },
  {
    id: "financial",
    name: "Financial Analysis",
    description: "Revenue reports and insights",
    icon: "TrendingUp",
    enabled: true,
    route: "/admin/financial",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Property upkeep tracking",
    icon: "Wrench",
    enabled: true,
    route: "/admin/maintenance",
  },
  {
    id: "employees",
    name: "Employee Management",
    description: "Staff scheduling and payroll",
    icon: "Users",
    enabled: false,
    route: "/admin/employees",
  },
];
