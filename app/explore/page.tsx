"use client";

import { useSearchParams } from "next/navigation";
import { properties } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Bath, Search } from "lucide-react"; // Tady byl chybějící Search
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function ExploreContent() {
  const searchParams = useSearchParams();
  
  const locationQuery = searchParams.get("location")?.toLowerCase() || "";
  const guestsQuery = parseInt(searchParams.get("guests") || "0");

  const filteredProperties = properties.filter((item) => {
    const matchLocation = item.location.toLowerCase().includes(locationQuery) || 
                         item.name.toLowerCase().includes(locationQuery);
    const matchGuests = guestsQuery > 0 ? item.maxGuests >= guestsQuery : true;
    return matchLocation && matchGuests;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Výsledky hledání</h1>
        <p className="text-muted-foreground mt-1">
          {locationQuery ? `Ubytování v lokalitě: ${locationQuery}` : "Všechna ubytování"} 
          ({filteredProperties.length} nalezeno)
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
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {property.maxGuests}</span>
                    <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <p className="text-2xl font-bold">${property.pricePerNight}<span className="text-sm font-normal text-muted-foreground">/noc</span></p>
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
          <h3 className="text-xl font-semibold">Žádné výsledky</h3>
          <p className="text-muted-foreground">Zkuste změnit lokalitu nebo počet hostů.</p>
          <Link href="/" className="mt-4 inline-block text-primary underline">Zpět na úvod</Link>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <Suspense fallback={<div className="text-center py-20">Načítání...</div>}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}