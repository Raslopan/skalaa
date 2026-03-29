"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MapPin, Users, Bed, Bath, Search, Loader2, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Property } from "@/lib/types";
import useSWR from "swr";

async function fetchProperties(): Promise<Property[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("location") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [minGuests, setMinGuests] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: properties, error, isLoading } = useSWR<Property[]>(
    "all-properties",
    fetchProperties
  );

  // Calculate max price from properties
  const maxPrice = useMemo(() => {
    if (!properties || properties.length === 0) return 1000;
    return Math.max(...properties.map(p => p.price_per_night)) + 100;
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    let result = properties.filter((item) => {
      const matchSearch = 
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = 
        item.price_per_night >= priceRange[0] && 
        item.price_per_night <= priceRange[1];
      const matchType = 
        propertyType === "all" || item.type === propertyType;
      const matchGuests = 
        minGuests === 0 || item.max_guests >= minGuests;
      
      return matchSearch && matchPrice && matchType && matchGuests;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result = result.sort((a, b) => a.price_per_night - b.price_per_night);
        break;
      case "price-high":
        result = result.sort((a, b) => b.price_per_night - a.price_per_night);
        break;
      case "guests":
        result = result.sort((a, b) => b.max_guests - a.max_guests);
        break;
      case "newest":
      default:
        // Already sorted by created_at desc from the query
        break;
    }

    return result;
  }, [properties, searchQuery, priceRange, propertyType, minGuests, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set("location", searchQuery);
    router.push(`/explore?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
    setPropertyType("all");
    setMinGuests(0);
    setSortBy("newest");
    router.push("/explore");
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice || 
    propertyType !== "all" || 
    minGuests > 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading accommodations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <p className="text-destructive">Error loading data.</p>
          <Link href="/" className="mt-4 inline-block text-primary underline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </form>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="guests">Most Guests</SelectItem>
              </SelectContent>
            </Select>

            {/* Filters Sheet (Mobile-friendly) */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <Label>Price per night</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={maxPrice}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-3">
                    <Label>Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Guests */}
                  <div className="space-y-3">
                    <Label>Minimum Guests</Label>
                    <Select value={String(minGuests)} onValueChange={(v) => setMinGuests(Number(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="2">2+ guests</SelectItem>
                        <SelectItem value="4">4+ guests</SelectItem>
                        <SelectItem value="6">6+ guests</SelectItem>
                        <SelectItem value="8">8+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Show {filteredProperties.length} Results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <button onClick={() => setPriceRange([0, maxPrice])} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {propertyType !== "all" && (
              <Badge variant="secondary" className="gap-1 capitalize">
                {propertyType}
                <button onClick={() => setPropertyType("all")} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {minGuests > 0 && (
              <Badge variant="secondary" className="gap-1">
                {minGuests}+ guests
                <button onClick={() => setMinGuests(0)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground mt-1">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
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
                    <Badge variant="outline" className="border-primary text-primary">Details</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/30">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No results found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          <Button variant="link" onClick={clearFilters} className="mt-4">
            Clear all filters
          </Button>
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
