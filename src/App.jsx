import React, { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";

const initialProducts = [
  { id: 1, name: "Laptop", category: "Electronics", price: 55000, quantity: 8, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85", description: "A reliable laptop for study, coding and everyday productivity." },
  { id: 2, name: "Wireless Mouse", category: "Electronics", price: 800, quantity: 20, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85", description: "A comfortable wireless mouse for work and study." },
  { id: 3, name: "Study Chair", category: "Furniture", price: 4500, quantity: 6, image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85", description: "A stylish chair for a comfortable study space." },
  { id: 4, name: "Notebook Set", category: "Stationery", price: 100, quantity: 35, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85", description: "Everyday notebooks for class notes and planning." },
  { id: 5, name: "Headphones", category: "Electronics", price: 1600, quantity: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", description: "Lightweight headphones for music, classes and calls." },
  { id: 6, name: "Desk Lamp", category: "Furniture", price: 950, quantity: 0, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", description: "A minimal desk lamp for your evening study sessions." }
];

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(value);

function Header({ cartCount }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark">N</span><span>nova<span className="brand-light">store</span></span></Link>
      <nav>
        <NavLink to="/" end>Products</NavLink>
        <NavLink to="/cart" className="cart-nav">Cart <span className="cart-count">{cartCount}</span></NavLink>
      </nav>
    </header>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <Link className="product-image-wrap" to={`/product/${product.id}`}>
        <img className="product-image" src={product.image} alt={product.name} />
        <span className={`stock-pill ${product.quantity === 0 ? "out" : ""}`}>
          {product.quantity === 0 ? "Out of stock" : `${product.quantity} in stock`}
        </span>
      </Link>
      <div className="product-info">
        <span className="category-label">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-title">{product.name}</Link>
        <div className="product-bottom">
          <strong>{money(product.price)}</strong>
          <button className="add-icon" onClick={() => onAdd(product)} disabled={product.quantity === 0} aria-label={`Add ${product.name} to cart`}>+</button>
        </div>
        <Link className="details-link" to={`/product/${product.id}`}>View details <span>↗</span></Link>
      </div>
    </article>
  );
}

function Home({ products, cart, onAdd }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const filteredProducts = useMemo(() => products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase().trim()) &&
    (category === "All" || p.category === category)
  ), [products, search, category]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.cartQty, 0), [cart]);
  const cartItems = useMemo(() => cart.reduce((sum, item) => sum + item.cartQty, 0), [cart]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot"></span> YOUR EVERYDAY ESSENTIALS</span>
          <h1>Good finds.<br /><span>Better days.</span></h1>
          <p>Discover useful picks for your desk, your studies and everything in between.</p>
          <a className="primary-button hero-button" href="#catalog">Explore products <span>↓</span></a>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
          <div className="hero-sticker">CURATED<br />FOR YOU ✳</div>
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85" alt="Laptop on a desk" />
          <div className="floating-note"><span>✦</span><div><b>Little things</b><small>that make a big difference</small></div></div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div><span className="eyebrow">THE COLLECTION</span><h2>Find your next <span>favourite.</span></h2></div>
          <span className="result-count">{filteredProducts.length} products</span>
        </div>
        <div className="filter-bar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" /><kbd>⌘ K</kbd></label>
          <label className="category-select"><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
        ) : (
          <div className="empty-state"><div className="empty-icon">⌕</div><h3>No products found</h3><p>Try another search or choose a different category.</p><button className="secondary-button" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button></div>
        )}
      </section>

      <section className="cart-summary">
        <div className="summary-icon">🛍</div><div className="summary-copy"><span>YOUR BAG</span><h3>{cartItems} {cartItems === 1 ? "item" : "items"} in your cart</h3><p>Good choices are waiting for you.</p></div>
        <div className="summary-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><Link className="primary-button" to="/cart">View cart <span>→</span></Link>
      </section>
    </main>
  );
}

function ProductDetails({ products, onAdd }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  if (!product) return <main className="page-shell"><div className="empty-state"><h2>Product not found</h2><Link className="primary-button" to="/">Back to products</Link></div></main>;
  return (
    <main className="page-shell">
      <div className="breadcrumbs"><Link to="/">Products</Link><span>/</span><span>{product.name}</span></div>
      <section className="details-layout">
        <div className="details-image"><img src={product.image} alt={product.name} /></div>
        <div className="details-copy"><span className="eyebrow">{product.category.toUpperCase()}</span><h1>{product.name}</h1><div className="details-price">{money(product.price)}</div><p>{product.description}</p><div className="detail-stock"><span className={product.quantity > 0 ? "green-dot" : "red-dot"}></span>{product.quantity > 0 ? `${product.quantity} units available` : "Currently out of stock"}</div><div className="detail-meta"><div><small>PRODUCT ID</small><b>NV-{String(product.id).padStart(3, "0")}</b></div><div><small>CATEGORY</small><b>{product.category}</b></div></div><button className="primary-button wide-button" disabled={product.quantity === 0} onClick={() => onAdd(product)}>Add to cart <span>→</span></button><button className="text-button" onClick={() => navigate(-1)}>← Back</button></div>
      </section>
    </main>
  );
}

function Cart({ cart, onChangeQty, onRemove }) {
  const navigate = useNavigate();
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.cartQty, 0), [cart]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.cartQty, 0), [cart]);
  if (cart.length === 0) return <main className="page-shell"><div className="cart-page-heading"><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1></div><div className="empty-state cart-empty"><div className="empty-icon">🛍</div><h2>Your cart is taking a little break.</h2><p>There are no items here yet. Let's find something useful.</p><button className="primary-button" onClick={() => navigate("/")}>Explore products <span>→</span></button></div></main>;
  return (
    <main className="page-shell">
      <div className="cart-page-heading"><span className="eyebrow">YOUR BAG</span><h1>Shopping cart <span>({count})</span></h1><p>Review your items before you check out.</p></div>
      <div className="cart-layout"><section className="cart-items"><div className="cart-table-head"><span>PRODUCT</span><span>QUANTITY</span><span>SUBTOTAL</span></div>
        {cart.map((item) => <article className="cart-row" key={item.id}><div className="cart-product"><img src={item.image} alt={item.name} /><div><Link to={`/product/${item.id}`}>{item.name}</Link><span>{item.category}</span><small>{money(item.price)} each</small><button className="remove-link mobile-remove" onClick={() => onRemove(item.id)}>Remove</button></div></div><div className="quantity-control"><button onClick={() => onChangeQty(item.id, -1)} aria-label="Decrease quantity">−</button><span>{item.cartQty}</span><button onClick={() => onChangeQty(item.id, 1)} disabled={item.cartQty >= item.quantity} aria-label="Increase quantity">+</button></div><div className="row-subtotal"><strong>{money(item.price * item.cartQty)}</strong><button className="remove-link desktop-remove" onClick={() => onRemove(item.id)}>Remove</button></div></article>)}
        <button className="text-button continue-button" onClick={() => navigate("/")}>← Continue shopping</button>
      </section>
      <aside className="order-summary"><span className="eyebrow">SUMMARY</span><h2>Order details</h2><div className="order-line"><span>Items ({count})</span><span>{money(total)}</span></div><div className="order-line"><span>Delivery</span><span className="free-label">FREE</span></div><div className="order-line"><span>Taxes</span><span>Included</span></div><div className="order-total"><span>Total</span><strong>{money(total)}</strong></div><button className="primary-button wide-button" onClick={() => window.alert("Checkout demo: your cart is ready!")}>Proceed to checkout <span>→</span></button><p className="secure-note">✓ Secure checkout demo</p></aside></div>
    </main>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    if (product.quantity === 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (existing.cartQty >= product.quantity) {
          window.alert("You have reached the available stock limit.");
          return current;
        }
        return current.map((item) => item.id === product.id ? { ...item, cartQty: item.cartQty + 1 } : item);
      }
      return [...current, { ...product, cartQty: 1 }];
    });
  };
  const changeQty = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, cartQty: Math.max(1, Math.min(item.quantity, item.cartQty + delta)) } : item));
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.cartQty, 0), [cart]);
  const products = initialProducts;
  return <><Header cartCount={cartCount} /><Routes><Route path="/" element={<Home products={products} cart={cart} onAdd={addToCart} />} /><Route path="/product/:id" element={<ProductDetails products={products} onAdd={addToCart} />} /><Route path="/cart" element={<Cart cart={cart} onChangeQty={changeQty} onRemove={removeFromCart} />} /><Route path="*" element={<main className="page-shell empty-state"><h2>Page not found</h2><Link to="/" className="primary-button">Go home</Link></main>} /></Routes><footer className="footer"><Link className="brand" to="/"><span className="brand-mark">N</span><span>nova<span className="brand-light">store</span></span></Link><span>Thoughtful picks for everyday life.</span><span>© 2026 Nova Store · React practical project</span></footer></>;
}