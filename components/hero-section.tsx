"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  Minus,
  Plus,
} from "lucide-react";

const cities = [
  { name: "Miami", country: "United States", popular: true },
  { name: "Aspen", country: "United States", popular: true },
  { name: "New York", country: "United States", popular: true },
  { name: "Malibu", country: "United States", popular: true },
  { name: "Paris", country: "France", popular: true },
  { name: "Prague", country: "Czech Republic", popular: false },
];

export function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [today, setToday] = useState<Date | undefined>(undefined);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities.filter((c) => c.popular));
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (destination.trim() === "") {
      setFilteredCities(cities.filter((c) => c.popular));
    } else {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(destination.toLowerCase()) ||
          city.country.toLowerCase().includes(destination.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [destination]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("location", destination);
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > 0) params.set("guests", totalGuests.toString());
    
    router.push(`/explore?${params.toString()}`);
  };

  const updateGuests = (type: "adults" | "children" | "rooms", increment: boolean) => {
    setGuests((prev) => ({
      ...prev,
      [type]: increment
        ? prev[type] + 1
        : Math.max(type === "adults" || type === "rooms" ? 1 : 0, prev[type] - 1),
    }));
  };

  return (
    <section className="relative bg-primary pb-32 pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">
          Najděte své další ubytování
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
          Prohledávejte tisíce domů, apartmánů a vil z naší databáze.
        </p>

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="rounded-xl bg-accent p-1 shadow-xl">
            <div className="grid gap-1 md:grid-cols-[1fr_auto_auto_auto]">
              {/* Lokalita */}
              <div className="relative">
                <div className="flex items-center rounded-lg bg-background px-4 py-3">
                  <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Kam jedete?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="border-0 p-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                {showSuggestions && (
                  <div ref={suggestionsRef} className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border bg-background shadow-lg text-left">
                    {filteredCities.map((city) => (
                      <button
                        key={city.name}
                        className="flex w-full items-center gap-3 px-3 py-2 hover:bg-secondary"
                        onClick={() => { setDestination(city.name); setShowSuggestions(false); }}
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>{city.name}, <span className="text-xs">{city.country}</span></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Check-in */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-left hover:bg-secondary">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      {checkIn ? format(checkIn, "dd.MM.yyyy") : "Příjezd"}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkIn} onSelect={setCheckIn} /></PopoverContent>
              </Popover>

              {/* Hosté */}
              <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg bg-background px-4 py-3 text-left hover:bg-secondary min-w-[150px]">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm font-medium">{guests.adults + guests.children} hosté</div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Dospělí</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateGuests("adults", false)}>-</Button>
                        <span>{guests.adults}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateGuests("adults", true)}>+</Button>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setGuestsOpen(false)}>Hotovo</Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <Button size="lg" onClick={handleSearch} className="h-auto rounded-lg bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                <Search className="h-5 w-5" />
                <span className="ml-2">Hledat</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}