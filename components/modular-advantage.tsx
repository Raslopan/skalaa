import {
  Calendar,
  Shield,
  CreditCard,
  Clock,
  Headphones,
  Award,
} from "lucide-react";

const advantages = [
  {
    icon: Calendar,
    title: "Flexible Booking",
    description:
      "Change or cancel most bookings for free up to 24 hours before your stay.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Your payment information is protected with industry-leading encryption.",
  },
  {
    icon: CreditCard,
    title: "Best Price Guarantee",
    description:
      "Found a lower price elsewhere? We'll match it and give you an additional 10% off.",
  },
  {
    icon: Clock,
    title: "Instant Confirmation",
    description:
      "Book your stay and receive instant confirmation with all the details you need.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer service team is available around the clock to assist you.",
  },
  {
    icon: Award,
    title: "Verified Reviews",
    description:
      "All reviews are from verified guests who have completed their stay.",
  },
];

export function ModularAdvantage() {
  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            The StayHub Advantage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Experience the flexibility and peace of mind that comes with booking
            through StayHub
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group relative rounded-xl bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <advantage.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {advantage.title}
              </h3>
              <p className="text-muted-foreground">{advantage.description}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-xl bg-accent transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 rounded-2xl bg-primary p-8 sm:p-12">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-4xl font-bold text-accent">2M+</div>
              <div className="mt-2 text-primary-foreground/80">
                Properties Listed
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">150+</div>
              <div className="mt-2 text-primary-foreground/80">
                Countries Covered
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">50M+</div>
              <div className="mt-2 text-primary-foreground/80">
                Happy Travelers
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">4.8</div>
              <div className="mt-2 text-primary-foreground/80">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
