import { Check, Heart, Minus, Plus, ShoppingBag, Star, Truck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { lenisRef } from "@/hooks/useSmoothScroll";
import { ease } from "@/lib/motion";
import { Placeholder } from "./shared";

// Kiln Goods — a fictional handmade-ceramics store. Palette: oat, charcoal, terracotta.
const C = { bg: "#f6f1ea", card: "#fffdf9", fg: "#1c1a17", muted: "#7a7166", accent: "#d0643a", line: "rgb(28 26 23 / 0.1)" };

const FREE_SHIPPING = 2500;
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

const PRODUCTS = [
  { id: 1, name: "Dune Mug", cat: "Mugs", price: 890, rating: 4.9, tones: ["#e7c9a9", "#b3714d"], tag: "Bestseller" },
  { id: 2, name: "Tide Bowl Set", cat: "Bowls", price: 2190, rating: 4.8, tones: ["#c9d6cf", "#5f7f74"] },
  { id: 3, name: "Ember Bud Vase", cat: "Vases", price: 1450, rating: 4.7, tones: ["#f0b38d", "#c4502b"], tag: "New" },
  { id: 4, name: "Salt Dinner Plate", cat: "Plates", price: 1190, rating: 4.9, tones: ["#efe9df", "#a69a88"] },
  { id: 5, name: "Moss Espresso Cup", cat: "Mugs", price: 690, rating: 4.6, tones: ["#c8cfa6", "#6c7442"] },
  { id: 6, name: "Night Ramen Bowl", cat: "Bowls", price: 1290, rating: 4.8, tones: ["#6c7180", "#262a33"], tag: "Low stock" },
  { id: 7, name: "Column Vase", cat: "Vases", price: 2890, rating: 5.0, tones: ["#e5d6c4", "#8b6d50"] },
  { id: 8, name: "Speckle Side Plate", cat: "Plates", price: 790, rating: 4.7, tones: ["#f4ead8", "#c9a77a"] },
];
const CATEGORIES = ["All", "Mugs", "Bowls", "Vases", "Plates"];
const SORTS = {
  featured: { label: "Featured", fn: (a, b) => a.id - b.id },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  rated: { label: "Top rated", fn: (a, b) => b.rating - a.rating },
};

function ProductCard({ product, onAdd, liked, onLike }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease }}
      className="group rounded-3xl p-2.5"
      style={{ background: C.card, boxShadow: `0 0 0 1px ${C.line}` }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.8, ease }}>
          <Placeholder from={product.tones[0]} via="#ebe3d8" to={product.tones[1]} label={product.name} className="aspect-square">
            {/* A simple vessel silhouette so the placeholder still reads as "ceramics". */}
            <span
              aria-hidden
              className="absolute bottom-[18%] left-1/2 h-[46%] w-[42%] -translate-x-1/2 rounded-b-[45%] rounded-t-[18%] shadow-[inset_-12px_-10px_30px_rgb(0_0_0/0.25)]"
              style={{ background: `linear-gradient(140deg, ${product.tones[0]}, ${product.tones[1]})` }}
            />
          </Placeholder>
        </motion.div>
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: C.fg, color: C.bg }}>
            {product.tag}
          </span>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={onLike}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={liked}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 backdrop-blur"
        >
          <Heart className="size-4" fill={liked ? C.accent : "none"} stroke={liked ? C.accent : C.fg} />
        </motion.button>
      </div>

      <div className="px-2 pb-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
              <Star className="size-3" fill={C.fg} stroke="none" /> {product.rating.toFixed(1)} · {product.cat}
            </p>
          </div>
          <span className="font-semibold">{inr(product.price)}</span>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onAdd(product);
            setAdded(true);
          }}
          className="relative mt-4 flex h-11 w-full items-center justify-center overflow-hidden rounded-full text-sm font-medium transition-colors"
          style={{ background: added ? C.accent : C.fg, color: C.bg }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={added ? "added" : "add"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex items-center gap-2"
            >
              {added ? <><Check className="size-4" /> Added</> : <><Plus className="size-4" /> Add to cart</>}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}

function CartDrawer({ open, onClose, items, setQty }) {
  const [ordered, setOrdered] = useState(false);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const toFree = Math.max(0, FREE_SHIPPING - subtotal);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    lenisRef.current?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenisRef.current?.start();
      setOrdered(false);
    };
  }, [open, onClose]);

  // Portalled: the page-transition wrapper is transformed, which would trap a `fixed` drawer inside it.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" style={{ color: C.fg }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col"
            style={{ background: C.bg }}
          >
            <header className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: C.line }}>
              <h3 className="text-lg font-medium">Your cart ({items.reduce((n, i) => n + i.qty, 0)})</h3>
              <button type="button" onClick={onClose} aria-label="Close cart" className="grid size-9 place-items-center rounded-full hover:bg-black/5">
                <X className="size-5" />
              </button>
            </header>

            {ordered ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid flex-1 place-items-center p-10 text-center">
                <div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="mx-auto grid size-16 place-items-center rounded-full text-white"
                    style={{ background: C.accent }}
                  >
                    <Check className="size-8" />
                  </motion.span>
                  <p className="mt-6 text-2xl font-medium">Order placed!</p>
                  <p className="mt-2 text-sm" style={{ color: C.muted }}>This is a demo store — nothing was charged.</p>
                </div>
              </motion.div>
            ) : items.length === 0 ? (
              <div className="grid flex-1 place-items-center p-10 text-center" style={{ color: C.muted }}>
                <div>
                  <ShoppingBag className="mx-auto size-10" />
                  <p className="mt-4">Your cart is empty.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <p className="flex items-center gap-2 text-sm">
                    <Truck className="size-4" />
                    {toFree ? <>Add <b>{inr(toFree)}</b> more for free shipping</> : "You’ve unlocked free shipping!"}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: C.line }}>
                    <motion.div
                      animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
                      transition={{ duration: 0.6, ease }}
                      className="h-full rounded-full"
                      style={{ background: C.accent }}
                    />
                  </div>
                </div>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="flex items-center gap-4 rounded-2xl p-3"
                        style={{ background: C.card }}
                      >
                        <Placeholder from={item.tones[0]} via="#ebe3d8" to={item.tones[1]} label={item.name} className="size-16 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="text-sm" style={{ color: C.muted }}>{inr(item.price)}</p>
                          <div className="mt-2 inline-flex items-center gap-3 rounded-full border px-1 py-0.5" style={{ borderColor: C.line }}>
                            <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)} className="grid size-6 place-items-center rounded-full hover:bg-black/5">
                              <Minus className="size-3" />
                            </button>
                            <span className="w-4 text-center text-sm tabular-nums">{item.qty}</span>
                            <button type="button" aria-label={`Increase ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)} className="grid size-6 place-items-center rounded-full hover:bg-black/5">
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums">{inr(item.price * item.qty)}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t px-6 py-5" style={{ borderColor: C.line }}>
                  <div className="flex justify-between text-sm" style={{ color: C.muted }}>
                    <span>Shipping</span>
                    <span>{toFree ? inr(99) : "Free"}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{inr(subtotal + (toFree ? 99 : 0))}</span>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOrdered(true)}
                    className="mt-5 h-12 w-full rounded-full font-medium text-white"
                    style={{ background: C.accent }}
                  >
                    Checkout
                  </motion.button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function StoreSample() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [liked, setLiked] = useState(() => new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const visible = useMemo(
    () => PRODUCTS.filter((p) => category === "All" || p.cat === category).sort(SORTS[sort].fn),
    [category, sort]
  );
  const count = cart.reduce((n, i) => n + i.qty, 0);

  const addToCart = (product) =>
    setCart((items) => {
      const existing = items.find((i) => i.id === product.id);
      return existing
        ? items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { ...product, qty: 1 }];
    });
  const setQty = (id, qty) =>
    setCart((items) => (qty < 1 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i))));
  const toggleLike = (id) =>
    setLiked((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div style={{ background: C.bg, color: C.fg }}>
      <p className="py-2 text-center text-xs font-medium" style={{ background: C.fg, color: C.bg }}>
        Free shipping over {inr(FREE_SHIPPING)} · Handmade in Jaipur
      </p>
      <nav className="flex items-center justify-between px-5 py-5 md:px-10">
        <span className="text-xl font-semibold tracking-tight">kiln<span style={{ color: C.accent }}>.</span>goods</span>
        <ul className="hidden gap-7 text-sm md:flex" style={{ color: C.muted }}>
          <li>Shop</li><li>Collections</li><li>Journal</li><li>Visit</li>
        </ul>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
          style={{ borderColor: C.line }}
        >
          <ShoppingBag className="size-4" /> Cart
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="grid size-5 place-items-center rounded-full text-[11px] font-semibold text-white"
                style={{ background: C.accent }}
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <header className="grid gap-6 px-5 pb-12 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="flex flex-col justify-end rounded-[28px] p-8 md:p-12"
          style={{ background: C.card, boxShadow: `0 0 0 1px ${C.line}` }}
        >
          <p className="text-sm font-medium" style={{ color: C.accent }}>Autumn collection</p>
          <h2 className="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            Slow-made pieces for everyday rituals.
          </h2>
          <p className="mt-4 max-w-sm" style={{ color: C.muted }}>
            Wheel-thrown stoneware, glazed in small batches. Every piece is one of a kind.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.3 }}>
          <Placeholder from="#f0b38d" via="#d9c7b2" to="#8b6d50" label="Autumn collection on a linen table" className="h-72 rounded-[28px] md:h-full md:min-h-80">
            <span className="absolute bottom-5 left-5 rounded-full bg-white/85 px-4 py-2 text-sm font-medium backdrop-blur">Up to 20% off sets</span>
          </Placeholder>
        </motion.div>
      </header>

      <section className="px-5 pb-16 md:px-10" aria-label="Products">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                onClick={() => setCategory(c)}
                className="relative rounded-full px-4 py-2 text-sm transition-colors"
                style={{ color: category === c ? C.bg : C.fg }}
              >
                {category === c && (
                  <motion.span layoutId="store-chip" transition={{ type: "spring", stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full" style={{ background: C.fg }} />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: C.line, color: C.fg }}
            >
              {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <motion.div layout className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} liked={liked.has(p.id)} onLike={() => toggleLike(p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <CartDrawer open={cartOpen} onClose={closeCart} items={cart} setQty={setQty} />
    </div>
  );
}
