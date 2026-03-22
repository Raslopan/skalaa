"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Bath, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Property } from "@/lib/queries";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function ExploreContent() {
  const searchParams = useSearchParams();
  const { data: properties, isLoading } = useSWR<Property[]>("/api/properties", fetcher);
  
  const locationQuery = searchParams.get("location")?.toLowerCase() || "";
  const guestsQuery = parseInt(searchParams.get("guests") || "0");

  const filteredProperties = (properties || []).filter((item) => {
    const matchLocation = item.location.toLowerCase().includes(locationQuery) || 
                         item.name.toLowerCase().includes(locationQuery);
    const matchGuests = guestsQuery > 0 ? item.max_guests >= guestsQuery : true;
    return matchLocation && matchGuests;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground mt-1">
          {locationQuery ? `Accommodations in: ${locationQuery}` : "All accommodations"} 
          ({filteredProperties.length} found)
        </p>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Link key={property.id} href={`/accommodation/${property.id}`} className="group">
              <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-xl">
                <div className="relative aspect-[16/10]">
                  <Image 
                    src={property.image} 
                    alt={property.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute left-3 top-3 bg-white/90 text-black hover:bg-white capitalize">
                    {property.type}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </div>
                  <h2 className="font-bold text-xl mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                    {property.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {property.max_guests}</span>
                    <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <p className="text-2xl font-bold">${property.price_per_night}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                    <Badge variant="outline" className="border-primary text-primary">Detail</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/30">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No results</h3>
          <p className="text-muted-foreground">Try changing your location or guest count.</p>
          <Link href="/" className="mt-4 inline-block text-primary underline">Back to home</Link>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}
