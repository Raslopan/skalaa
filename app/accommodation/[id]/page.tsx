"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  MapPin,
  ArrowLeft,
  Wifi,
  Car,
  Utensils,
  Wind,
  Tv,
  Bath,
  Users,
  Bed,
} from "lucide-react";

const accommodations = [
  {
    id: 1,
    title: "Oceanfront Paradise Villa",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop",
    price: 450,
    rating: 4.9,
    reviews: 234,
    type: "Villa",
    featured: true,
    description: "Experience the ultimate luxury escape in our stunning oceanfront villa. Wake up to breathtaking views of crystal-clear turquoise waters and pristine white sand beaches. This exclusive retreat offers unparalleled privacy and world-class amenities.",
    bedrooms: 3,
    bathrooms: 2,
    guests: 6,
    amenities: ["wifi", "parking", "restaurant", "ac", "tv", "pool"],
  },
  {
    id: 2,
    title: "Alpine Mountain Chalet",
    location: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    price: 320,
    rating: 4.8,
    reviews: 189,
    type: "Chalet",
    featured: false,
    description: "Nestled in the heart of the Swiss Alps, this charming chalet offers a perfect blend of rustic charm and modern comfort. Enjoy panoramic mountain views, cozy fireplaces, and easy access to world-class ski slopes.",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    amenities: ["wifi", "parking", "ac", "tv"],
  },
  {
    id: 3,
    title: "Historic City Center Apartment",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    price: 180,
    rating: 4.7,
    reviews: 412,
    type: "Apartment",
    featured: false,
    description: "Stay in the heart of Paris in this beautifully renovated historic apartment. Just steps from iconic landmarks, charming cafes, and world-renowned museums. Experience authentic Parisian living with modern conveniences.",
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    amenities: ["wifi", "ac", "tv"],
  },
  {
    id: 4,
    title: "Luxury Beach Resort Suite",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    price: 280,
    rating: 4.9,
    reviews: 567,
    type: "Resort",
    featured: true,
    description: "Indulge in tropical luxury at our exclusive Bali resort suite. Surrounded by lush gardens and overlooking pristine beaches, this suite offers the perfect sanctuary for relaxation and rejuvenation.",
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    amenities: ["wifi", "parking", "restaurant", "ac", "tv", "pool"],
  },
  {
    id: 5,
    title: "Modern Downtown Loft",
    location: "New York City",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    price: 220,
    rating: 4.6,
    reviews: 298,
    type: "Loft",
    featured: false,
    description: "Experience the energy of NYC in this stylish downtown loft. Featuring industrial-chic design, floor-to-ceiling windows, and a prime location near trendy restaurants, galleries, and entertainment.",
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    amenities: ["wifi", "ac", "tv"],
  },
  {
    id: 6,
    title: "Serene Lake House Retreat",
    location: "Lake Como, Italy",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    price: 390,
    rating: 4.8,
    reviews: 156,
    type: "House",
    featured: true,
    description: "Escape to this stunning lakehouse on the shores of Lake Como. Enjoy breathtaking water views, private dock access, and the charm of one of Italy's most beautiful destinations.",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    amenities: ["wifi", "parking", "ac", "tv"],
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
  ac: <Wind className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
  pool: <Bath className="h-5 w-5" />,
};

const amenityLabels: Record<string, string> = {
  wifi: "Free WiFi",
  parking: "Free Parking",
  restaurant: "Restaurant",
  ac: "Air Conditioning",
  tv: "Smart TV",
  pool: "Swimming Pool",
};

export default function AccommodationDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const accommodation = accommodations.find((a) => a.id === id);

  if (!accommodation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold">Accommodation not found</h1>
        <Link href="/" className="mt-4">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to search</span>
          </Link>
          <Button variant="outline" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl md:aspect-[21/9]">
          <Image
            src={accommodation.image}
            alt={accommodation.title}
            fill
            className="object-cover"
            priority
          />
          {accommodation.featured && (
            <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{accommodation.location}</span>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              {accommodation.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                {accommodation.type}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold">{accommodation.rating}</span>
                <span className="text-muted-foreground">
                  ({accommodation.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-6 border-b pb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{accommodation.guests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span>{accommodation.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{accommodation.bathrooms} bathrooms</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">About this place</h2>
              <p className="leading-relaxed text-muted-foreground">
                {accommodation.description}
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {accommodation.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="text-primary">
                      {amenityIcons[amenity]}
                    </span>
                    <span className="text-sm font-medium">{amenityLabels[amenity]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">${accommodation.price}</span>
                  <span className="text-base font-normal text-muted-foreground">
                    / night
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Check-in</div>
                    <div className="mt-1 font-medium">Select date</div>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Check-out</div>
                    <div className="mt-1 font-medium">Select date</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Guests</div>
                  <div className="mt-1 font-medium">2 guests</div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Reserve
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {"You won't be charged yet"}
                </p>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${accommodation.price} x 5 nights
                    </span>
                    <span>${accommodation.price * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${Math.round(accommodation.price * 0.12)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>
                      ${accommodation.price * 5 + Math.round(accommodation.price * 0.12)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
