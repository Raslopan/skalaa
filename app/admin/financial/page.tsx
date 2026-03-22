"use client";

import { useState, useEffect } from "react";
import { properties, reservations } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  CreditCard,
  PieChart,
} from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 8500, expenses: 2100, bookings: 12 },
  { month: "Feb", revenue: 9200, expenses: 2300, bookings: 14 },
  { month: "Mar", revenue: 11500, expenses: 2500, bookings: 18 },
  { month: "Apr", revenue: 10800, expenses: 2200, bookings: 16 },
  { month: "May", revenue: 12300, expenses: 2800, bookings: 20 },
  { month: "Jun", revenue: 14500, expenses: 3100, bookings: 24 },
];

const expenseCategories = [
  { category: "Cleaning", amount: 1200, percentage: 35 },
  { category: "Maintenance", amount: 800, percentage: 23 },
  { category: "Utilities", amount: 600, percentage: 17 },
  { category: "Platform Fees", amount: 500, percentage: 15 },
  { category: "Insurance", amount: 350, percentage: 10 },
];

export default function FinancialPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const avgBookingValue = totalRevenue / reservations.length;
  const totalExpenses = expenseCategories.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const revenueByProperty = properties.map((property) => {
    const propertyReservations = reservations.filter(
      (r) => r.propertyId === property.id
    );
    const revenue = propertyReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const bookings = propertyReservations.length;
    return {
      ...property,
      revenue,
      bookings,
      avgRate: bookings > 0 ? Math.round(revenue / bookings) : 0,
    };
  });

  if (!mounted) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Financial Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track revenue, expenses, and profitability across your properties
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +12.5% vs last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Net Profit</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              {profitMargin}% margin
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Avg. Booking Value</CardDescription>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgBookingValue)}</div>
            <div className="mt-1 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +5.2% vs last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Occupancy Rate</CardDescription>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="mt-1 flex items-center text-sm text-red-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              -3.1% vs last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Revenue and expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRevenue.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right text-green-600">
                      ${row.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ${row.expenses.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${(row.revenue - row.expenses).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((expense) => (
                <div key={expense.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{expense.category}</span>
                    <span className="font-medium">${expense.amount}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="font-semibold">Total Expenses</span>
                <span className="font-bold">${totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Revenue by Property
          </CardTitle>
          <CardDescription>Performance breakdown per listing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Bookings</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg. Rate</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByProperty
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((property) => {
                    const performanceScore =
                      property.revenue > 0
                        ? Math.min(
                            100,
                            Math.round((property.revenue / totalRevenue) * 100 * 4)
                          )
                        : 0;
                    return (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {property.location}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{property.bookings}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${property.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${property.avgRate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full bg-accent transition-all"
                                style={{ width: `${performanceScore}%` }}
                              />
                            </div>
                            <span className="w-8 text-xs text-muted-foreground">
                              {performanceScore}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
