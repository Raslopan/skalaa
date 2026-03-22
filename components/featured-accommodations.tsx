"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin, Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/mock-data";

export function FeaturedAccommodations() {
  // Zobrazíme první 3 nemovitosti z mock-data jako "Featured"
  const featuredList = properties.slice(0, 3);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Doporučené ubytování
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ručně vybraná místa z našeho nového systému
            </p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="shrink-0">
              Zobrazit vše
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredList.map((property) => (
            <Link
              key={property.id}
              href={`/accommodation/${property.id}`}
              className="block"
            >
              <Card className="group overflow-hidden border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground capitalize">
                    {property.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background hover:text-destructive"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                  <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-card-foreground">
                    {property.name}
                  </h3>
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{property.maxGuests} hosté</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" />
                      <span>{property.bedrooms} ložnice</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        ${property.pricePerNight}
                      </span>
                      <span className="text-sm text-muted-foreground"> / noc</span>
                    </div>
                    <Button size="sm">Detail</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}