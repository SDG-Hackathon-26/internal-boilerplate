import { useState } from "react";
import { MapPin, Clock, ChevronRight, Star, Leaf, Search, Filter, ArrowRight, Package, TrendingDown, Users } from "lucide-react";

const categories = ["All", "Bakery", "Produce", "Deli", "Dairy", "Prepared"];

const listings = [
  {
    id: 1,
    vendor: "Flour & Stone Bakery",
    vendorType: "Bakery",
    item: "Sourdough & Pastry Bundle",
    description: "2 sourdough loaves, 4 croissants, assorted morning pastries",
    original: 28,
    discounted: 9,
    expires: "Today, 7 PM",
    stock: 3,
    distance: "0.4 km",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&auto=format",
    category: "Bakery",
    tag: "Last few",
  },
  {
    id: 2,
    vendor: "Green Lane Market",
    vendorType: "Supermarket",
    item: "Organic Produce Box",
    description: "Seasonal veg mix — courgettes, peppers, cherry tomatoes, spinach",
    original: 18,
    discounted: 6,
    expires: "Today, 8 PM",
    stock: 7,
    distance: "0.9 km",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1543168256-418811576931?w=600&h=400&fit=crop&auto=format",
    category: "Produce",
    tag: "Good deal",
  },
  {
    id: 3,
    vendor: "Combini Express",
    vendorType: "Convenience",
    item: "Ready Meal Selection",
    description: "3 bento boxes, 2 onigiri sets, assorted sushi rolls",
    original: 22,
    discounted: 8,
    expires: "Today, 9 PM",
    stock: 5,
    distance: "1.2 km",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=400&fit=crop&auto=format",
    category: "Prepared",
    tag: "Popular",
  },
  {
    id: 4,
    vendor: "The Dairy Shed",
    vendorType: "Dairy",
    item: "Artisan Cheese & Yoghurt",
    description: "Mixed soft cheese selection, 2 Greek yoghurts, crème fraîche",
    original: 16,
    discounted: 5,
    expires: "Tomorrow, 6 AM",
    stock: 9,
    distance: "1.5 km",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=400&fit=crop&auto=format",
    category: "Dairy",
    tag: null,
  },
  {
    id: 5,
    vendor: "Casa Napoli",
    vendorType: "Restaurant",
    item: "Pasta & Antipasti Box",
    description: "Handmade pasta portions, bruschetta, mixed antipasto platter",
    original: 32,
    discounted: 11,
    expires: "Today, 10 PM",
    stock: 2,
    distance: "0.7 km",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=400&fit=crop&auto=format",
    category: "Prepared",
    tag: "Selling fast",
  },
  {
    id: 6,
    vendor: "My Basket",
    vendorType: "Supermarket",
    item: "Deli Counter Closes",
    description: "Sliced meats, hummus tubs, smoked salmon ends, olives",
    original: 24,
    discounted: 7,
    expires: "Today, 8:30 PM",
    stock: 6,
    distance: "2.1 km",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop&auto=format",
    category: "Deli",
    tag: null,
  },
];

const globalStats = [
  { icon: Package, label: "Meals saved today", value: "1,204" },
  { icon: TrendingDown, label: "Avg. discount", value: "68%" },
  { icon: Users, label: "Active vendors", value: "340+" },
];

const nearbyStats = [
  { icon: MapPin, label: "Vendors within 2 km", value: "6" },
  { icon: Package, label: "Items available nearby", value: "28" },
  { icon: Clock, label: "Closest pickup", value: "0.4 km" },
];

function StockBar({ stock, max = 10 }: { stock: number; max?: number }) {
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock <= 2 ? "bg-accent" : stock <= 5 ? "bg-yellow-500" : "bg-primary";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground tabular-nums">{stock} left</span>
    </div>
  );
}

function ListingCard({ listing }: { listing: typeof listings[0] }) {
  const saving = Math.round(((listing.original - listing.discounted) / listing.original) * 100);
  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden bg-secondary h-48">
        <img
          src={listing.image}
          alt={`${listing.item} from ${listing.vendor}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full font-mono">
            -{saving}%
          </span>
          {listing.tag && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              {listing.tag}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{listing.vendor}</p>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{listing.item}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{listing.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>{listing.expires}</span>
          <span className="mx-1 opacity-40">·</span>
          <MapPin size={12} />
          <span>{listing.distance}</span>
          <span className="mx-1 opacity-40">·</span>
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span>{listing.rating}</span>
        </div>
        <StockBar stock={listing.stock} />
        <div className="flex items-baseline gap-2 pt-1 mt-auto">
          <span className="text-2xl font-display font-semibold text-foreground">£{listing.discounted}</span>
          <span className="text-sm text-muted-foreground line-through">£{listing.original}</span>
        </div>
      </div>
    </article>
  );
}

function Nav({ onBrowse, onHome }: { onBrowse: () => void; onHome: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">SecondServe</span>
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <button onClick={onBrowse} className="hover:text-foreground transition-colors">Browse</button>
          <a href="#" className="hover:text-foreground transition-colors">For Vendors</a>
          <a href="#" className="hover:text-foreground transition-colors">How it works</a>
        </nav>
        <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Sign in
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <Leaf size={14} className="text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">SecondServe</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Fighting food waste, one meal at a time. Commission-based. No subscription.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function LandingPage({ onBrowse }: { onBrowse: () => void }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1543168256-418811576931?w=1600&h=600&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-mono mb-4">
              Every meal deserves a second chance
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight mb-5">
              Great food.<br />
              <em className="italic font-light text-primary-foreground/80">Half the price.</em>
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
              Restaurants and markets near you are listing surplus food before it goes to waste. Browse today&apos;s deals and collect before closing.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={onBrowse}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Find food near me <ArrowRight size={16} />
              </button>
              <button className="border border-primary-foreground/30 text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                List your surplus
              </button>
            </div>
          </div>
        </div>
        {/* Global stats row */}
        <div className="relative border-t border-primary-foreground/10">
          <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-primary-foreground/10">
            {globalStats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-6 first:pl-0 last:pr-0">
                <Icon size={18} className="text-primary-foreground/50 shrink-0" />
                <div>
                  <p className="font-display font-semibold text-xl">{value}</p>
                  <p className="text-xs text-primary-foreground/50">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Nearby stats row */}
        <div className="relative border-t border-primary-foreground/10 bg-primary-foreground/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary-foreground/40 shrink-0">
              Near you
            </span>
            <div className="w-px h-4 bg-primary-foreground/20 mx-1" />
            <div className="grid grid-cols-3 flex-1 divide-x divide-primary-foreground/10">
              {nearbyStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 px-5 first:pl-0">
                  <Icon size={15} className="text-primary-foreground/40 shrink-0" />
                  <div>
                    <p className="font-mono font-semibold text-base leading-none">{value}</p>
                    <p className="text-xs text-primary-foreground/40 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Vendors CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 font-mono mb-3">For restaurants & markets</p>
            <h2 className="font-display text-4xl font-semibold leading-tight mb-4">
              Turn closing time<br />into extra revenue.
            </h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              List your surplus in under 2 minutes. We take a small commission only when food sells — no subscriptions, no upfront fees. Join 340 vendors already reducing waste and boosting end-of-day income.
            </p>
            <ul className="space-y-2 text-sm text-primary-foreground/80 mb-8">
              {[
                "Free to list, pay only on sales",
                "Real-time stock management dashboard",
                "Weekly payouts directly to your account",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <button className="bg-primary-foreground text-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              Join as a vendor <ChevronRight size={16} />
            </button>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-2xl overflow-hidden bg-primary-foreground/10 h-72">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop&auto=format"
                alt="Chef preparing food in restaurant kitchen"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Simple process</p>
          <h2 className="font-display text-3xl font-semibold">How SecondServe works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Vendors list surplus",
              body: "Restaurants and markets add items nearing end-of-day, set a discount, and publish. Takes under two minutes.",
            },
            {
              step: "02",
              title: "You browse nearby",
              body: "See what's available close to you. Live stock counts update in real time so you know exactly what's left.",
            },
            {
              step: "03",
              title: "Collect & enjoy",
              body: "Head to the vendor before closing and collect fresh food at a fraction of the original price.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="relative">
              <p className="font-mono text-5xl font-bold text-border mb-4">{step}</p>
              <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ListingsPage({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = listings
    .filter((l) => {
      const matchCat = activeCategory === "All" || l.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        l.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return (
    <>
      {/* Search & Filter Bar */}
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes, vendors…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Filter size={14} />
            Filters
          </button>
        </div>
      </section>

      {/* Listings grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <button
              onClick={onBack}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-1 flex items-center gap-1"
            >
              ← Back to home
            </button>
            <h2 className="font-display text-2xl font-semibold">
              {activeCategory === "All" ? "Available near you" : activeCategory}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{filtered.length} listings</p>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-display text-xl mb-2">Nothing found</p>
            <p className="text-sm">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<"landing" | "listings">("landing");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav onBrowse={() => setPage("listings")} onHome={() => setPage("landing")} />
      {page === "landing" ? (
        <LandingPage onBrowse={() => setPage("listings")} />
      ) : (
        <ListingsPage onBack={() => setPage("landing")} />
      )}
      <Footer />
    </div>
  );
}
