import { modules } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wrench,
  ArrowRight,
  Building2,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wrench,
  Building2,
};

export default function AdminHomePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Owner Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your properties, bookings, and business operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Properties</CardDescription>
            <CardTitle className="text-3xl">4</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Reservations</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month Revenue</CardDescription>
            <CardTitle className="text-3xl">$9,790</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Occupancy Rate</CardDescription>
            <CardTitle className="text-3xl">72%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">Available Modules</h2>
        <p className="text-sm text-muted-foreground">
          Select a module to get started
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = iconMap[module.icon] || Calendar;
          const isEnabled = module.enabled;

          const cardContent = (
            <Card
              className={`transition-all hover:shadow-md ${
                isEnabled
                  ? "hover:border-primary/50"
                  : "opacity-60"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {!isEnabled && (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                  {isEnabled && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="mt-4">{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isEnabled ? (
                  <span className="text-sm text-primary">Access module</span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    This module will be available soon
                  </span>
                )}
              </CardContent>
            </Card>
          );

          if (!isEnabled) {
            return (
              <div key={module.id} className="cursor-not-allowed">
                {cardContent}
              </div>
            );
          }

          return (
            <Link key={module.id} href={module.route}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
