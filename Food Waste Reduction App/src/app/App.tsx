import { useEffect, useState } from "react";
import {
  MapPin, Clock, ChevronRight, Star, Leaf, Search, Filter,
  ArrowRight, Package, TrendingDown, Users, Plus, Pencil,
  Trash2, CheckCircle, AlertTriangle, X, ChevronDown,
} from "lucide-react";
import logo from "../assets/logo.png";
import produceBoxImage from "./components/images/image.png";
import onigiriImage from "./components/images/onigiri.png";
import donutsImage from "./components/images/donuts.png";
import yakitoriImage from "./components/images/yakitori.png";
import pastaImage from "./components/images/pasta.png";
import menuIcon from "./components/icons/menu.png";

// ─── Shared data ─────────────────────────────────────────────────────────────

const categories = ["All", "Bakery", "Produce", "Deli", "Donuts", "Prepared"];

const listings = [
  {
    id: 1, vendor: "French", vendorType: "Bakery",
    item: "Sourdough Bread",
    description: "2 day old Sourdough Bread",
    original: 800, discounted: 500, expires: "Tomorrow, 7 PM", stock: 3,
    distance: "0.4 km", rating: 4.9,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&auto=format",
    category: "Bakery", tag: "Last few",
  },
  {
    id: 2, vendor: "Big Birds", vendorType: "Supermarket",
    item: "Organic Produce Box",
    description: "Seasonal veg mix — potato, carrot, onion, cabbage",
    original: 900, discounted: 500, expires: "Tomorrow, 8 PM", stock: 7,
    distance: "0.9 km", rating: 4.7,
    image: produceBoxImage,
    category: "Produce", tag: "Good deal",
  },
  {
    id: 3, vendor: "Six Seven", vendorType: "Convenience",
    item: "Onigiri Assortment",
    description: "2 Tuna Mayos, 2 Salmon",
    original: 800, discounted: 500, expires: "Today, 9 PM", stock: 5,
    distance: "1.2 km", rating: 4.6,
    image: onigiriImage,
    category: "Prepared", tag: "Popular",
  },
  {
    id: 4, vendor: "Mrs. Donuts", vendorType: "Donuts",
    item: "Box of Donuts Assortment",
    description: "6 random donuts in a box",
    original: 800, discounted: 800, expires: "Tomorrow, 6 AM", stock: 9,
    distance: "1.5 km", rating: 4.8,
    image: donutsImage,
    category: "Dairy", tag: null,
  },
  {
    id: 5, vendor: "Casa Napoli", vendorType: "Restaurant",
    item: "A Bag of Pasta",
    description: "Handmade pasta 300g",
    original: 800, discounted: 500, expires: "Tomorrow, 10 PM", stock: 2,
    distance: "0.7 km", rating: 4.9,
    image: pastaImage,
    category: "Prepared", tag: "Selling fast",
  },
  {
    id: 6, vendor: "My Basket", vendorType: "Supermarket",
    item: "Deli Counter Closes",
    description: " 1 Box of  Yakitori, 1 Box of Karaage",
    original: 900, discounted: 600, expires: "Tomorrow, 00:00 AM", stock: 6,
    distance: "2.1 km", rating: 4.5,
    image: yakitoriImage,
    category: "Deli", tag: null,
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

type Page = "landing" | "listings" | "vendors" | "how-it-works" | "purchase-success";

// ─── Shared sub-components ────────────────────────────────────────────────────

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

function Nav({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("landing")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="SecondServe logo"
                className="w-8 h-8"
              />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">SecondServe</span>
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {([["listings", "Browse"], ["vendors", "For Vendors"], ["how-it-works", "How it works"]] as [Page, string][]).map(([page, label]) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`transition-colors ${current === page ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          className="bg-primary text-primary-foreground text-sm font-semibold p-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <img src={menuIcon} alt="" className="w-5 h-5" />
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
        <p className="text-xs text-muted-foreground">Fighting food waste, one meal at a time. Commission-based. No subscription.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

function LandingPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1543168256-418811576931?w=1600&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-mono mb-4">Every meal deserves a second chance</p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight mb-5">
              Great food.<br /><em className="italic font-light text-primary-foreground/80">Half the price.</em>
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
              Restaurants and markets near you are listing surplus food before it goes to waste. Browse today&apos;s deals and collect before closing.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("listings")} className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                Find food near me <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate("vendors")} className="border border-primary-foreground/30 text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                List your surplus
              </button>
            </div>
          </div>
        </div>
        <div className="relative border-t border-primary-foreground/10">
          <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-primary-foreground/10">
            {globalStats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-6 first:pl-0 last:pr-0">
                <Icon size={18} className="text-primary-foreground/50 shrink-0" />
                <div><p className="font-display font-semibold text-xl">{value}</p><p className="text-xs text-primary-foreground/50">{label}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative border-t border-primary-foreground/10 bg-primary-foreground/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary-foreground/40 shrink-0">Near you</span>
            <div className="w-px h-4 bg-primary-foreground/20 mx-1" />
            <div className="grid grid-cols-3 flex-1 divide-x divide-primary-foreground/10">
              {nearbyStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 px-5 first:pl-0">
                  <Icon size={15} className="text-primary-foreground/40 shrink-0" />
                  <div><p className="font-mono font-semibold text-base leading-none">{value}</p><p className="text-xs text-primary-foreground/40 mt-0.5">{label}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/50 font-mono mb-3">For restaurants & markets</p>
            <h2 className="font-display text-4xl font-semibold leading-tight mb-4">Turn closing time<br />into extra revenue.</h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">List your surplus in under 2 minutes. We take a small commission only when food sells — no subscriptions, no upfront fees. Join 340 vendors already reducing waste.</p>
            <ul className="space-y-2 text-sm text-primary-foreground/80 mb-8">
              {["Free to list, pay only on sales", "Real-time stock management dashboard", "Weekly payouts directly to your account"].map((p) => (
                <li key={p} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50 shrink-0" />{p}</li>
              ))}
            </ul>
            <button onClick={() => navigate("vendors")} className="bg-primary-foreground text-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              Join as a vendor <ChevronRight size={16} />
            </button>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-2xl overflow-hidden h-72">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop&auto=format" alt="Chef preparing food in restaurant kitchen" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Simple process</p>
          <h2 className="font-display text-3xl font-semibold">How SecondServe works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[
            { step: "01", title: "Vendors list surplus", body: "Restaurants and markets add items nearing end-of-day, set a discount, and publish in under two minutes." },
            { step: "02", title: "You browse nearby", body: "See what's available close to you. Live stock counts update in real time." },
            { step: "03", title: "Collect & enjoy", body: "Head to the vendor before closing and collect fresh food at a fraction of the price." },
          ].map(({ step, title, body }) => (
            <div key={step}>
              <p className="font-mono text-5xl font-bold text-border mb-4">{step}</p>
              <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigate("how-it-works")} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mx-auto">
            Read the full guide <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </>
  );
}

// ─── Listings page ────────────────────────────────────────────────────────────

function ListingCard({ listing, onPurchase }: { listing: typeof listings[0]; onPurchase: (listing: typeof listings[0]) => void }) {
  const saving = Math.round(((listing.original - listing.discounted) / listing.original) * 100);
  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden bg-secondary h-48">
        <img src={listing.image} alt={`${listing.item} from ${listing.vendor}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full font-mono">-{saving}%</span>
          {listing.tag && <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">{listing.tag}</span>}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{listing.vendor}</p>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{listing.item}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{listing.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} /><span>{listing.expires}</span>
          <span className="mx-1 opacity-40">·</span>
          <MapPin size={12} /><span>{listing.distance}</span>
          <span className="mx-1 opacity-40">·</span>
          <Star size={12} className="text-yellow-500 fill-yellow-500" /><span>{listing.rating}</span>
        </div>
        <StockBar stock={listing.stock} />
        <div className="flex items-baseline gap-2 pt-1 mt-auto">
          <span className="text-2xl font-display font-semibold text-foreground">¥{listing.discounted}</span>
          <span className="text-sm text-muted-foreground line-through">¥{listing.original}</span>
        </div>
        <button
          type="button"
          onClick={() => onPurchase(listing)}
          className="w-full bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Purchase
        </button>
      </div>
    </article>
  );
}

function ListingsPage({ onBack, onPurchase }: { onBack: () => void; onPurchase: (listing: typeof listings[0]) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = listings
    .filter((l) => {
      const matchCat = activeCategory === "All" || l.category === activeCategory;
      const matchSearch = !searchQuery || l.item.toLowerCase().includes(searchQuery.toLowerCase()) || l.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return (
    <>
      <section className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search dishes, vendors…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div className="min-w-0 max-w-full overflow-x-auto pb-1 sm:pb-0">
            <div className="flex w-max items-center gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 whitespace-nowrap text-sm font-medium px-4 py-2 rounded-lg transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{cat}</button>
              ))}
            </div>
          </div>
          <button className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"><Filter size={14} />Filters</button>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-1 flex items-center gap-1">← Back to home</button>
            <h2 className="font-display text-2xl font-semibold">{activeCategory === "All" ? "Available near you" : activeCategory}</h2>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{filtered.length} listings</p>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} onPurchase={onPurchase} />)}
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

// ─── Purchase success page ────────────────────────────────────────────────────

function DummyBarcode() {
  const bars = [3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 4, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1];

  return (
    <div className="bg-card border border-border rounded-xl px-6 py-5 w-full max-w-sm">
      <div className="h-28 flex items-stretch justify-center gap-1">
        {bars.map((width, index) => (
          <div key={index} className="bg-foreground rounded-sm" style={{ width: `${width * 3}px` }} />
        ))}
      </div>
      <p className="font-mono text-center text-sm tracking-[0.3em] mt-4 text-muted-foreground">4927 0184 6639</p>
    </div>
  );
}

function PurchaseSuccessPage({ listing, navigate }: { listing: typeof listings[0] | null; navigate: (p: Page) => void }) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6">
          <CheckCircle size={56} />
        </div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Order confirmed</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mb-3">Purchase successful</h1>
        <p className="text-muted-foreground max-w-lg mb-8">
          Show this barcode at pickup to redeem{listing ? ` your ${listing.item} from ${listing.vendor}` : " your purchased item"}.
        </p>
        <DummyBarcode />
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("listings")}
            className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to listings
          </button>
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="bg-secondary text-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
          >
            Home
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── For Vendors page ─────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  category: string;
  original: number;
  discounted: number;
  stock: number;
  expiryDate: string;
  expiryTime: string;
  location: string;
  status: "active" | "low" | "sold-out";
};

const initialProducts: Product[] = [
  { id: 1, name: "Sourdough & Pastry Bundle", category: "Bakery", original: 28, discounted: 9, stock: 3, expiryDate: "2026-06-20", expiryTime: "19:00", location: "14 Brick Lane, E1 6RF", status: "low" },
  { id: 2, name: "Rye Loaves (x4)", category: "Bakery", original: 14, discounted: 5, stock: 6, expiryDate: "2026-06-20", expiryTime: "19:00", location: "14 Brick Lane, E1 6RF", status: "active" },
  { id: 3, name: "Croissant Box (x6)", category: "Bakery", original: 12, discounted: 4, stock: 0, expiryDate: "2026-06-20", expiryTime: "18:00", location: "14 Brick Lane, E1 6RF", status: "sold-out" },
];

const blankProduct = { name: "", category: "Bakery", original: 0, discounted: 0, stock: 1, expiryDate: "", expiryTime: "", location: "14 Brick Lane, E1 6RF" };

function StatusBadge({ status }: { status: Product["status"] }) {
  const map = {
    active: "bg-primary/10 text-primary",
    low: "bg-yellow-100 text-yellow-700",
    "sold-out": "bg-accent/10 text-accent",
  };
  const label = { active: "Active", low: "Low stock", "sold-out": "Sold out" };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{label[status]}</span>;
}

function VendorsPage({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(blankProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const totalSaved = products.reduce((a, p) => a + (p.original - p.discounted) * (10 - p.stock), 0);
  const activeCount = products.filter((p) => p.status !== "sold-out").length;

  function openNew() {
    setForm(blankProduct);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setForm({ name: p.name, category: p.category, original: p.original, discounted: p.discounted, stock: p.stock, expiryDate: p.expiryDate, expiryTime: p.expiryTime, location: p.location });
    setEditId(p.id);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.name || !form.expiryDate) return;
    const stock = Number(form.stock);
    const status: Product["status"] = stock === 0 ? "sold-out" : stock <= 3 ? "low" : "active";
    if (editId !== null) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, stock, status } : p));
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { id: newId, ...form, stock, status }]);
    }
    setShowForm(false);
  }

  function updateStock(id: number, delta: number) {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const stock = Math.max(0, p.stock + delta);
      const status: Product["status"] = stock === 0 ? "sold-out" : stock <= 3 ? "low" : "active";
      return { ...p, stock, status };
    }));
  }

  function deleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 flex items-center gap-1">← Back to home</button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Vendor Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0" />Flour & Stone Bakery · 14 Brick Lane, E1 6RF
            </p>
          </div>
          <button onClick={openNew} className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
            <Plus size={16} />Add product
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active listings", value: String(activeCount), sub: `${products.length} total` },
          { label: "Items in stock", value: String(products.reduce((a, p) => a + p.stock, 0)), sub: "across all listings" },
          { label: "Est. revenue today", value: `¥${products.reduce((a, p) => a + p.discounted * p.stock, 0)}`, sub: `¥${totalSaved}+ saved for customers` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Current listings</h2>
          <span className="text-xs text-muted-foreground font-mono">{products.length} products</span>
        </div>
        <div className="divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">{p.name}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={11} />{p.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />Expires {p.expiryDate} at {p.expiryTime}</span>
                  <span className="font-mono">¥{p.discounted} <span className="line-through opacity-50">¥{p.original}</span></span>
                </div>
              </div>
              {/* Stock stepper */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateStock(p.id, -1)} disabled={p.stock === 0} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm font-bold hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">−</button>
                  <span className="font-mono text-sm w-6 text-center font-semibold">{p.stock}</span>
                  <button onClick={() => updateStock(p.id, 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm font-bold hover:bg-secondary transition-colors">+</button>
                </div>
                <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <Package size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-display text-base mb-1">No products listed</p>
              <p className="text-sm">Add your first product to start selling.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-lg">{editId !== null ? "Edit product" : "Add new product"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Product name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sourdough Bundle" className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Category</label>
                <div className="relative">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none pr-8">
                    {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Stock quantity</label>
                <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Original price (¥)</label>
                <input type="number" min={0} value={form.original || ""} onChange={(e) => setForm({ ...form, original: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Discounted price (¥)</label>
                <input type="number" min={0} value={form.discounted || ""} onChange={(e) => setForm({ ...form, discounted: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Expiry date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Pickup by (time)</label>
                <input type="time" value={form.expiryTime} onChange={(e) => setForm({ ...form, expiryTime: e.target.value })} className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Location / address</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. 14 Brick Lane, E1 6RF" className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold bg-secondary rounded-lg hover:opacity-80 transition-opacity">Cancel</button>
              <button onClick={saveForm} disabled={!form.name || !form.expiryDate} className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                <CheckCircle size={15} />{editId !== null ? "Save changes" : "Add product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <AlertTriangle size={32} className="text-accent mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Remove listing?</h3>
            <p className="text-sm text-muted-foreground mb-5">This product will be removed from the marketplace immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 text-sm font-semibold bg-secondary rounded-lg hover:opacity-80 transition-opacity">Keep it</button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 py-2 text-sm font-semibold bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">Remove</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── How it works page ────────────────────────────────────────────────────────

function HowItWorksPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState<"customers" | "vendors">("customers");

  const customerSteps = [
    {
      step: "01",
      title: "Open SecondServe",
      body: "Visit secondserve.co on any device. No app download needed — it works right in your browser. Allow location access so we can show you deals nearby.",
      icon: "🌍",
    },
    {
      step: "02",
      title: "Browse what's near you",
      body: "You'll see a list of food available from restaurants, bakeries, and markets within walking or cycling distance. Each listing shows the vendor name, address, items included, original price, discounted price, and how many portions are left.",
      icon: "🔍",
    },
    {
      step: "03",
      title: "Check the stock & expiry",
      body: "Each listing shows a live stock bar so you can see exactly how many are left. Check the expiry time — this is the latest you can collect. First come, first served.",
      icon: "📦",
    },
    {
      step: "04",
      title: "Head to the vendor",
      body: "Once you find something you want, just go to the vendor before the listed pickup time. No app, no QR code, no reservation needed — just show up and ask for the SecondServe deal.",
      icon: "🚶",
    },
    {
      step: "05",
      title: "Pay & collect",
      body: "Pay the discounted price in-store. You get fresh food, the vendor recovers some revenue, and good food stays out of the bin.",
      icon: "✅",
    },
  ];

  const vendorSteps = [
    {
      step: "01",
      title: "Create your vendor account",
      body: "Sign up at secondserve.co/vendors. Enter your restaurant or market name, address, and bank details for weekly payouts. Verification takes under 24 hours.",
      icon: "🏪",
    },
    {
      step: "02",
      title: "List your surplus items",
      body: "From your dashboard, click \"Add product\". Enter the item name, what's included, the original and discounted price, stock quantity, expiry date, and pickup-by time. Publish instantly.",
      icon: "✏️",
    },
    {
      step: "03",
      title: "Update stock in real time",
      body: "As items sell or if stock changes, use the +/− buttons on your dashboard to update quantities immediately. Listings with 0 stock are automatically marked as sold out and hidden from customers.",
      icon: "🔄",
    },
    {
      step: "04",
      title: "Customers come to you",
      body: "No delivery, no packaging. Customers see your listing, come in before closing time, and buy directly from you. You handle the transaction your way.",
      icon: "🤝",
    },
    {
      step: "05",
      title: "We take a small commission",
      body: "SecondServe charges a 12% commission on each sale made through the platform. No monthly fee, no listing fee. You only pay when food sells. Weekly payouts go straight to your account.",
      icon: "💷",
    },
  ];

  const steps = activeTab === "customers" ? customerSteps : vendorSteps;

  return (
    <main>
      {/* Hero */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/50 font-mono mb-4">Guide</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">How SecondServe works</h1>
          <p className="text-primary-foreground/60 text-lg leading-relaxed max-w-xl mx-auto">
            Whether you're here to find a deal or reduce your end-of-day waste, this is everything you need to know.
          </p>
        </div>
      </section>

      {/* Tab switcher */}
      <div className="bg-secondary border-b border-border sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-6 flex gap-1 py-2">
          {(["customers", "vendors"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "customers" ? "For customers" : "For vendors"}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-border hidden md:block" />
          <div className="space-y-10">
            {steps.map(({ step, title, body, icon }, i) => (
              <div key={step} className="flex gap-8 items-start">
                <div className="relative shrink-0 hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xl z-10">
                    {icon}
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:hidden">{icon}</span>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{step}</span>
                    <h3 className="font-display text-xl font-semibold">{title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-secondary border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h2 className="font-display text-2xl font-semibold mb-8">Common questions</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-7">
            {(activeTab === "customers" ? [
              { q: "Do I need an account?", a: "No account needed to browse. You only need to Profile to save favourites or get notifications when your preferred vendors list something new." },
              { q: "Is the food safe to eat?", a: "Yes. Listings are for food that's close to its best-before or end-of-service date — not spoiled. Vendors are responsible for food safety compliance." },
              { q: "Can I reserve items?", a: "Listings are first-come, first-served. Stock counts update live so you can see what's left before you head over." },
              { q: "What if I arrive and it's gone?", a: "If stock runs out before you arrive, the listing will show as sold out. We recommend checking shortly before you leave." },
            ] : [
              { q: "How much does it cost?", a: "Listing is free. SecondServe takes 12% commission on each completed sale. No subscription, no upfront fees." },
              { q: "How do I get paid?", a: "Payouts are processed weekly every Monday to the bank account you registered with. You can view sales history in your dashboard." },
              { q: "What if I sell out early?", a: "Update your stock to 0 using the dashboard stepper. The listing will be hidden from customers automatically." },
              { q: "Can I list multiple locations?", a: "Yes. You can add multiple venue locations under one account — useful for chains or market stalls across different sites." },
            ]).map(({ q, a }) => (
              <div key={q}>
                <h4 className="font-semibold text-sm mb-1.5">{q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-semibold mb-3">
            {activeTab === "customers" ? "Ready to find a deal?" : "Ready to reduce your waste?"}
          </h2>
          <p className="text-primary-foreground/60 mb-7">
            {activeTab === "customers" ? "See what's available near you right now." : "List your first product in under two minutes."}
          </p>
          <button
            onClick={() => navigate(activeTab === "customers" ? "listings" : "vendors")}
            className="bg-primary-foreground text-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            {activeTab === "customers" ? "Browse nearby food" : "Go to vendor dashboard"} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [purchasedListing, setPurchasedListing] = useState<typeof listings[0] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [page]);

  const handlePurchase = (listing: typeof listings[0]) => {
    setPurchasedListing(listing);
    setPage("purchase-success");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav current={page} navigate={setPage} />
      {page === "landing" && <LandingPage navigate={setPage} />}
      {page === "listings" && <ListingsPage onBack={() => setPage("landing")} onPurchase={handlePurchase} />}
      {page === "purchase-success" && <PurchaseSuccessPage listing={purchasedListing} navigate={setPage} />}
      {page === "vendors" && <VendorsPage onBack={() => setPage("landing")} />}
      {page === "how-it-works" && <HowItWorksPage navigate={setPage} />}
      <Footer />
    </div>
  );
}
