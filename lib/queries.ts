import { sql } from "./db";

// Types
export interface Property {
  id: string;
  name: string;
  type: "apartment" | "house" | "villa" | "studio";
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image: string;
}

export interface Reservation {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in: Date;
  check_out: Date;
  guests: number;
  total_price: number;
  status: "confirmed" | "pending" | "cancelled";
  created_at: Date;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  route: string;
}

export interface MaintenanceTask {
  id: string;
  property_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  due_date: Date;
  created_at: Date;
}

export interface CalendarDay {
  date: Date;
  status: "available" | "occupied" | "maintenance" | "blocked";
  reservationId?: string;
  price?: number;
}

// Property queries
export async function getProperties(): Promise<Property[]> {
  const rows = await sql`SELECT * FROM properties ORDER BY name`;
  return rows as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const rows = await sql`SELECT * FROM properties WHERE id = ${id}`;
  return (rows[0] as Property) || null;
}

export async function createProperty(property: Omit<Property, "id">): Promise<Property> {
  const id = `prop-${Date.now()}`;
  const rows = await sql`
    INSERT INTO properties (id, name, type, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, image)
    VALUES (${id}, ${property.name}, ${property.type}, ${property.location}, ${property.price_per_night}, ${property.max_guests}, ${property.bedrooms}, ${property.bathrooms}, ${property.amenities}, ${property.image})
    RETURNING *
  `;
  return rows[0] as Property;
}

export async function updateProperty(id: string, property: Partial<Property>): Promise<Property | null> {
  const rows = await sql`
    UPDATE properties SET
      name = COALESCE(${property.name}, name),
      type = COALESCE(${property.type}, type),
      location = COALESCE(${property.location}, location),
      price_per_night = COALESCE(${property.price_per_night}, price_per_night),
      max_guests = COALESCE(${property.max_guests}, max_guests),
      bedrooms = COALESCE(${property.bedrooms}, bedrooms),
      bathrooms = COALESCE(${property.bathrooms}, bathrooms),
      amenities = COALESCE(${property.amenities}, amenities),
      image = COALESCE(${property.image}, image)
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Property) || null;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM properties WHERE id = ${id}`;
  return result.length > 0 || true;
}

// Reservation queries
export async function getReservations(): Promise<Reservation[]> {
  const rows = await sql`SELECT * FROM reservations ORDER BY check_in DESC`;
  return rows as Reservation[];
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const rows = await sql`SELECT * FROM reservations WHERE id = ${id}`;
  return (rows[0] as Reservation) || null;
}

export async function getReservationsByProperty(propertyId: string): Promise<Reservation[]> {
  const rows = await sql`SELECT * FROM reservations WHERE property_id = ${propertyId} ORDER BY check_in DESC`;
  return rows as Reservation[];
}

export async function createReservation(reservation: Omit<Reservation, "id" | "created_at">): Promise<Reservation> {
  const id = `res-${Date.now()}`;
  const rows = await sql`
    INSERT INTO reservations (id, property_id, guest_name, guest_email, check_in, check_out, guests, total_price, status)
    VALUES (${id}, ${reservation.property_id}, ${reservation.guest_name}, ${reservation.guest_email}, ${reservation.check_in}, ${reservation.check_out}, ${reservation.guests}, ${reservation.total_price}, ${reservation.status})
    RETURNING *
  `;
  return rows[0] as Reservation;
}

export async function updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation | null> {
  const rows = await sql`
    UPDATE reservations SET
      property_id = COALESCE(${reservation.property_id}, property_id),
      guest_name = COALESCE(${reservation.guest_name}, guest_name),
      guest_email = COALESCE(${reservation.guest_email}, guest_email),
      check_in = COALESCE(${reservation.check_in}, check_in),
      check_out = COALESCE(${reservation.check_out}, check_out),
      guests = COALESCE(${reservation.guests}, guests),
      total_price = COALESCE(${reservation.total_price}, total_price),
      status = COALESCE(${reservation.status}, status)
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Reservation) || null;
}

export async function deleteReservation(id: string): Promise<boolean> {
  await sql`DELETE FROM reservations WHERE id = ${id}`;
  return true;
}

// Module queries
export async function getModules(): Promise<Module[]> {
  const rows = await sql`SELECT * FROM modules ORDER BY name`;
  return rows as Module[];
}

export async function getEnabledModules(): Promise<Module[]> {
  const rows = await sql`SELECT * FROM modules WHERE enabled = true ORDER BY name`;
  return rows as Module[];
}

export async function updateModuleEnabled(id: string, enabled: boolean): Promise<Module | null> {
  const rows = await sql`
    UPDATE modules SET enabled = ${enabled} WHERE id = ${id} RETURNING *
  `;
  return (rows[0] as Module) || null;
}

// Maintenance queries
export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  const rows = await sql`SELECT * FROM maintenance_tasks ORDER BY due_date`;
  return rows as MaintenanceTask[];
}

export async function getMaintenanceTasksByProperty(propertyId: string): Promise<MaintenanceTask[]> {
  const rows = await sql`SELECT * FROM maintenance_tasks WHERE property_id = ${propertyId} ORDER BY due_date`;
  return rows as MaintenanceTask[];
}

export async function createMaintenanceTask(task: Omit<MaintenanceTask, "id" | "created_at">): Promise<MaintenanceTask> {
  const id = `maint-${Date.now()}`;
  const rows = await sql`
    INSERT INTO maintenance_tasks (id, property_id, title, description, priority, status, due_date)
    VALUES (${id}, ${task.property_id}, ${task.title}, ${task.description}, ${task.priority}, ${task.status}, ${task.due_date})
    RETURNING *
  `;
  return rows[0] as MaintenanceTask;
}

export async function updateMaintenanceTask(id: string, task: Partial<MaintenanceTask>): Promise<MaintenanceTask | null> {
  const rows = await sql`
    UPDATE maintenance_tasks SET
      property_id = COALESCE(${task.property_id}, property_id),
      title = COALESCE(${task.title}, title),
      description = COALESCE(${task.description}, description),
      priority = COALESCE(${task.priority}, priority),
      status = COALESCE(${task.status}, status),
      due_date = COALESCE(${task.due_date}, due_date)
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as MaintenanceTask) || null;
}

export async function deleteMaintenanceTask(id: string): Promise<boolean> {
  await sql`DELETE FROM maintenance_tasks WHERE id = ${id}`;
  return true;
}

// Calendar data generation
export async function generateCalendarData(
  propertyId: string,
  year: number,
  month: number
): Promise<CalendarDay[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const propertyReservations = await sql`
    SELECT * FROM reservations 
    WHERE property_id = ${propertyId} 
    AND status != 'cancelled'
    AND (
      (check_in >= ${new Date(year, month, 1)} AND check_in < ${new Date(year, month + 1, 1)})
      OR (check_out > ${new Date(year, month, 1)} AND check_out <= ${new Date(year, month + 1, 1)})
      OR (check_in < ${new Date(year, month, 1)} AND check_out > ${new Date(year, month + 1, 1)})
    )
  `;
  
  const property = await getPropertyById(propertyId);
  const basePrice = property?.price_per_night || 100;

  const calendarDays: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    let status: CalendarDay["status"] = "available";
    let reservationId: string | undefined;

    // Check if date falls within any reservation
    for (const reservation of propertyReservations as Reservation[]) {
      const checkIn = new Date(reservation.check_in);
      const checkOut = new Date(reservation.check_out);
      if (date >= checkIn && date < checkOut) {
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

// Statistics helpers
export async function getReservationStats() {
  const totalReservations = await sql`SELECT COUNT(*) as count FROM reservations`;
  const confirmedReservations = await sql`SELECT COUNT(*) as count FROM reservations WHERE status = 'confirmed'`;
  const pendingReservations = await sql`SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'`;
  const totalRevenue = await sql`SELECT COALESCE(SUM(total_price), 0) as sum FROM reservations WHERE status = 'confirmed'`;
  
  return {
    total: Number(totalReservations[0].count),
    confirmed: Number(confirmedReservations[0].count),
    pending: Number(pendingReservations[0].count),
    revenue: Number(totalRevenue[0].sum),
  };
}

export async function getPropertyStats() {
  const totalProperties = await sql`SELECT COUNT(*) as count FROM properties`;
  const avgPrice = await sql`SELECT COALESCE(AVG(price_per_night), 0) as avg FROM properties`;
  
  return {
    total: Number(totalProperties[0].count),
    avgPrice: Number(avgPrice[0].avg),
  };
}
