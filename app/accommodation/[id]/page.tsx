"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
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
  Dumbbell,
  Flame,
  Snowflake,
  WashingMachine,
  Waves,
  UtensilsCrossed,
  ShowerHead,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Property } from "@/lib/types";
import useSWR from "swr";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  Parking: <Car className="h-5 w-5" />,
  Kitchen: <UtensilsCrossed className="h-5 w-5" />,
  AC: <Wind className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  Pool: <Waves className="h-5 w-5" />,
  Gym: <Dumbbell className="h-5 w-5" />,
  "Hot Tub": <ShowerHead className="h-5 w-5" />,
  Fireplace: <Flame className="h-5 w-5" />,
  "Ski Storage": <Snowflake className="h-5 w-5" />,
  Doorman: <Users className="h-5 w-5" />,
  "Washer/Dryer": <WashingMachine className="h-5 w-5" />,
  "Beach Access": <Waves className="h-5 w-5" />,
  BBQ: <Utensils className="h-5 w-5" />,
  Patio: <Wind className="h-5 w-5" />,
};

const amenityLabels: Record<string, string> = {
  WiFi: "Free WiFi",
  Parking: "Free Parking",
  Kitchen: "Full Kitchen",
  AC: "Air Conditioning",
  TV: "Smart TV",
  Pool: "Swimming Pool",
  Gym: "Fitness Center",
  "Hot Tub": "Hot Tub",
  Fireplace: "Fireplace",
  "Ski Storage": "Ski Storage",
  Doorman: "24h Doorman",
  "Washer/Dryer": "Washer/Dryer",
  "Beach Access": "Beach Access",
  BBQ: "BBQ Grill",
  Patio: "Outdoor Patio",
};

async function fetchProperty(id: string): Promise<Property | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

export default function AccommodationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: property, error, isLoading } = useSWR<Property | null>(
    id ? `property-${id}` : null,
    () => fetchProperty(id)
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Načítání ubytování...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold">Ubytování nenalezeno</h1>
        <p className="text-muted-foreground mt-2">Tato nemovitost neexistuje nebo byla odstraněna.</p>
        <Link href="/explore" className="mt-4">
          <Button>Zpět na vyhledávání</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/explore" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-5 w-5" />
            <span>Zpět na vyhledávání</span>
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
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
          <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground capitalize">
            {property.type}
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              {property.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium capitalize">
                {property.type}
              </Badge>
            </div>

            <div className="mb-8 flex flex-wrap gap-6 border-b pb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{property.max_guests} hostů</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span>{property.bedrooms} ložnice</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{property.bathrooms} koupelny</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">O tomto ubytování</h2>
              <p className="leading-relaxed text-muted-foreground">
                Vychutnejte si pobyt v tomto krásném {property.type === "apartment" ? "apartmánu" : property.type === "villa" ? "vile" : property.type === "house" ? "domě" : "studiu"} v lokalitě {property.location}. 
                Ideální pro {property.max_guests} hostů s {property.bedrooms} ložnicemi a {property.bathrooms} koupelnami.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Vybavení</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="text-primary">
                      {amenityIcons[amenity] || <Wifi className="h-5 w-5" />}
                    </span>
                    <span className="text-sm font-medium">{amenityLabels[amenity] || amenity}</span>
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
                  <span className="text-3xl font-bold text-foreground">${property.price_per_night}</span>
                  <span className="text-base font-normal text-muted-foreground">
                    / noc
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Check-in</div>
                    <div className="mt-1 font-medium">Vyberte datum</div>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Check-out</div>
                    <div className="mt-1 font-medium">Vyberte datum</div>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:border-primary/30">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hosté</div>
                  <div className="mt-1 font-medium">2 hosté</div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Rezervovat
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {"Zatím vám nic neúčtujeme"}
                </p>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${property.price_per_night} x 5 nocí
                    </span>
                    <span>${property.price_per_night * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servisní poplatek</span>
                    <span>${Math.round(property.price_per_night * 0.12)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Celkem</span>
                    <span>
                      ${property.price_per_night * 5 + Math.round(property.price_per_night * 0.12)}
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
