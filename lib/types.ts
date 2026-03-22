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
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: "confirmed" | "pending" | "cancelled";
  created_at?: string;
}
