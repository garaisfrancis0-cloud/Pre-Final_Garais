import { useState, type FormEvent } from 'react'
import './index.css'

type Product = {
  id: number
  name: string
  category: string
  description: string
  specification: string
  rating: number
  price: number
  quantity: number
  image: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Adasdas',
    category: 'Everyday',
    description: 'Comfortable everyday sneakers for school, errands, and casual walks.',
    specification: 'Canvas upper • Cushioned insole • Rubber outsole',
    rating: 4.8,
    price: 1299,
    quantity: 8,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMa8Kh149zq85eCR7kH_EUDPa-juJLg7ac5Y3VOQYIXQ&s=10',
  },
  {
    id: 2,
    name: 'Black Shoes',
    category: 'Smart Casual',
    description: 'A clean, versatile pair that works with jeans and smart-casual outfits.',
    specification: 'Leather-style upper • Padded collar • Lace-up fit',
    rating: 4.6,
    price: 1899,
    quantity: 3,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqmUTYmWBPiGn_ZDCcl1ghp3vOxpWEFEIaAD2sGwZ7HQ&s=10',
  },
  {
    id: 3,
    name: 'Rusi 9',
    category: 'Sports',
    description: 'Lightweight shoes for active days and comfortable everyday movement.',
    specification: 'Mesh upper • Lightweight midsole • Grip outsole',
    rating: 4.7,
    price: 1599,
    quantity: 12,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS94jYUrsF0qR6qumZhGvLLwy_nmVlQvsmo4PNxFso0VfUPSefjIsuknE4&s=10',
  },
  {
    id: 4,
    name: 'Harabas High',
    category: 'Streetwear',
    description: 'A bold high-top sneaker for a relaxed streetwear look.',
    specification: 'Canvas upper • High-top design • Rubber sole',
    rating: 4.5,
    price: 1749,
    quantity: 4,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85',
  },
]

const categories = ['All shoes', 'Everyday', 'Smart Casual', 'Sports', 'Streetwear']

const money = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(amount)

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [category, setCategory] = useState('All shoes')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [showForm, setShowForm] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [notice, setNotice] = useState('')

  const [form, setForm] = useState({
    name: '',
    category: 'Everyday',
    description: '',
    specification: '',
    rating: '4.5',
    price: '',
    quantity: '',
    image: '',
  })

  const visibleProducts = products.filter(
    (product) =>
      category === 'All shoes' || product.category === category,
  )

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  )

  const cartTotal = products.reduce(
    (total, product) =>
      total + product.price * (cart[product.id] ?? 0),
    0,
  )

  const inventoryTotal = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  )

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function changeCart(productId: number, change: number) {
    const product = products.find((item) => item.id === productId)
    const currentQuantity = cart[productId] ?? 0
    const nextQuantity = Math.max(0, currentQuantity + change)

    if (change > 0 && product && nextQuantity > product.quantity) {
      notify('You cannot add more pairs than the available stock.')
      return
    }

    setCart((current) => ({
      ...current,
      [productId]: nextQuantity,
    }))
  }

  function addToCart(product: Product) {
    if (product.quantity < 1) {
      notify('This pair is currently out of stock.')
      return
    }

    if ((cart[product.id] ?? 0) >= product.quantity) {
      notify('You have reached the available stock for this pair.')
      return
    }

    changeCart(product.id, 1)
    notify(`${product.name} added to your bag.`)
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newProduct: Product = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      specification: form.specification.trim(),
      rating: Number(form.rating),
      price: Number(form.price),
      quantity: Number(form.quantity),
      image: form.image.trim(),
    }

    setProducts((current) => [newProduct, ...current])
    setCategory('All shoes')
    setForm({
      name: '',
      category: 'Everyday',
      description: '',
      specification: '',
      rating: '4.5',
      price: '',
      quantity: '',
      image: '',
    })
    setShowForm(false)
    notify(`${newProduct.name} added to the collection.`)
  }

  return (
    <div className="app">
      <div className="announcement">
        GOOD SHOES FOR EVERYDAY MILES <span>✳</span> LOCAL FINDS, SOLID PAIRS
      </div>

      <header className="header">
        <a className="logo" href="#home" onClick={() => {
          setSelectedProduct(null)
          setShowCart(false)
        }}>
          <span className="logo-mark">SB</span>
          <span>
            SAPATOS <b>NI BOBOY</b>
            <small>SHOES WITH SOUL</small>
          </span>
        </a>

        <nav>
          <a href="#collection" onClick={() => {
            setSelectedProduct(null)
            setShowCart(false)
          }}>COLLECTION</a>
          <a href="#story">OUR STORY</a>
        </nav>

        <button
          className="bag-button"
          onClick={() => {
            setShowCart(true)
            setSelectedProduct(null)
          }}
        >
          MY CART <span>{cartCount}</span>
        </button>
      </header>

      <main id="home">
        {selectedProduct ? (
          <section className="detail-page">
            <button className="back-button" onClick={() => setSelectedProduct(null)}>
              ← BACK TO COLLECTION
            </button>

            <div className="detail-layout">
              <div className="detail-photo">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <span className="photo-tag">BOBOY'S PICK</span>
              </div>

              <div className="detail-info">
                <p className="eyebrow">{selectedProduct.category} / FEATURED PAIR</p>
                <h1>{selectedProduct.name}</h1>
                <p className="rating">★★★★★ <span>{selectedProduct.rating.toFixed(1)} / 5</span></p>
                <p className="detail-price">{money(selectedProduct.price)}</p>
                <p className="description">{selectedProduct.description}</p>

                <div className="specification">
                  <p className="eyebrow">PRODUCT SPECIFICATION</p>
                  <p>{selectedProduct.specification}</p>
                </div>

                <p className={selectedProduct.quantity < 5 ? 'stock low' : 'stock'}>
                  {selectedProduct.quantity < 5
                    ? `Only ${selectedProduct.quantity} pair(s) left — low stock`
                    : `${selectedProduct.quantity} pairs available`}
                </p>

                <button
                  className="primary-button full-button"
                  disabled={selectedProduct.quantity < 1}
                  onClick={() => addToCart(selectedProduct)}
                >
                  ADD TO CART {money(selectedProduct.price)}
                </button>
              </div>
            </div>
          </section>
        ) : showCart ? (
          <section className="section cart-page">
            <button className="back-button" onClick={() => setShowCart(false)}>
              ← CONTINUE SHOPPING
            </button>
            <p className="eyebrow">YOUR SELECTED PAIRS</p>
            <h1 className="section-title">Your shoe cart<span>.</span></h1>

            {cartCount === 0 ? (
              <div className="empty-cart">
                <div className="empty-symbol">＋</div>
                <h2>Your cart is empty.</h2>
                <p>Find a pair that fits your everyday style.</p>
                <button className="primary-button" onClick={() => setShowCart(false)}>
                  EXPLORE SHOES
                </button>
              </div>
            ) : (
              <div className="cart-layout">
                <div className="cart-list">
                  {products
                    .filter((product) => (cart[product.id] ?? 0) > 0)
                    .map((product) => (
                      <article className="cart-item" key={product.id}>
                        <img src={product.image} alt={product.name} />
                        <div className="cart-item-info">
                          <h3>{product.name}</h3>
                          <p>{money(product.price)} per pair</p>
                          <b>Subtotal: {money(product.price * cart[product.id])}</b>
                        </div>
                        <div className="quantity-control">
                          <button onClick={() => changeCart(product.id, -1)} aria-label="Remove one">−</button>
                          <span>{cart[product.id]}</span>
                          <button onClick={() => changeCart(product.id, 1)} aria-label="Add one">+</button>
                        </div>
                      </article>
                    ))}
                </div>

                <aside className="order-summary">
                  <p className="eyebrow">ORDER SUMMARY</p>
                  <div className="summary-line">
                    <span>Total pairs</span><b>{cartCount}</b>
                  </div>
                  <div className="summary-line">
                    <span>Subtotal</span><b>{money(cartTotal)}</b>
                  </div>
                  <div className="summary-total">
                    <span>TOTAL</span><strong>{money(cartTotal)}</strong>
                  </div>
                  <p className="small-note">Delivery fees are not included.</p>
                  <button className="primary-button full-button" onClick={() => notify('Demo checkout only. No payment was processed.')}>
                    CHECK OUT
                  </button>
                </aside>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">✳ THE NEIGHBORHOOD SHOE SHOP</p>
                <h1>Find your fit.<br /><em>Walk your way.</em></h1>
                <p className="hero-description">
                  From everyday lakad to weekend plans, discover shoes that
                  match your style and keep you moving.
                </p>
                <a className="primary-button" href="#collection">
                  SHOP THE COLLECTION ↗
                </a>
                <div className="hero-note">
                  <span>01 — EVERYDAY STYLE</span>
                  <span>MADE FOR YOUR NEXT STEP</span>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1200&q=90"
                  alt="Sneakers from the shoe collection"
                />
                <div className="hero-sticker">WALK<br /><b>YOUR WAY</b><br />✳ BOBOY'S SHOP</div>
                <span className="image-caption">THE DAILY ROTATION / PH</span>
              </div>
            </section>

            <div className="ticker">
              GOOD FIT, GOOD DAY <span>✳</span> WALK IT YOUR WAY <span>✳</span>
              MADE FOR THE DAILY GRIND <span>✳</span> GOOD FIT, GOOD DAY
            </div>

            <section id="collection" className="section collection">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PICK YOUR EVERYDAY FAVORITE</p>
                  <h2 className="section-title">The good pairs<span>.</span></h2>
                </div>
                <button className="outline-button" onClick={() => setShowForm(!showForm)}>
                  {showForm ? '− CLOSE FORM' : '+ ADD A PRODUCT'}
                </button>
              </div>

              <div className="collection-toolbar">
                <div className="filters">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={category === item ? 'filter active' : 'filter'}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <span className="count">{visibleProducts.length} PAIRS</span>
              </div>

              {showForm && (
                <form className="product-form" onSubmit={submitProduct}>
                  <div className="form-heading">
                    <div>
                      <p className="eyebrow">GROW THE COLLECTION</p>
                      <h3>Add a new pair</h3>
                    </div>
                    <span>ALL FIELDS REQUIRED</span>
                  </div>

                  <div className="form-grid">
                    <label>
                      Product name
                      <input
                        required minLength={2}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Lakad Low"
                      />
                    </label>

                    <label>
                      Category
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {categories.slice(1).map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Image URL
                      <input
                        required type="url"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://example.com/shoe.jpg"
                      />
                    </label>

                    <label>
                      Rating (0–5)
                      <input
                        required type="number" min="0" max="5" step="0.1"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      />
                    </label>

                    <label className="wide-field">
                      Description
                      <textarea
                        required minLength={5} rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe this pair..."
                      />
                    </label>

                    <label className="wide-field">
                      Specification
                      <input
                        required minLength={3}
                        value={form.specification}
                        onChange={(e) => setForm({ ...form, specification: e.target.value })}
                        placeholder="Material, sole, fit..."
                      />
                    </label>

                    <label>
                      Price (₱)
                      <input
                        required type="number" min="0.01" step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="1299"
                      />
                    </label>

                    <label>
                      Stock quantity
                      <input
                        required type="number" min="0" step="1"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        placeholder="10"
                      />
                    </label>
                  </div>

                  <button className="primary-button" type="submit">
                    ADD TO COLLECTION ↗
                  </button>
                </form>
              )}

              {visibleProducts.length === 0 ? (
                <p className="no-products">No products in this category yet.</p>
              ) : (
                <div className="product-grid">
                  {visibleProducts.map((product, index) => (
                    <article className="product-card" key={product.id}>
                      <button
                        className="product-image"
                        onClick={() => setSelectedProduct(product)}
                        aria-label={`View ${product.name} details`}
                      >
                        <img src={product.image} alt={product.name} />
                        <span className="product-number">PAIR / {String(index + 1).padStart(2, '0')}</span>
                        {product.quantity < 5 && <span className="low-badge">LOW STOCK</span>}
                        <span className="view-label">VIEW PAIR ↗</span>
                      </button>

                      <div className="product-info">
                        <div className="product-title">
                          <button onClick={() => setSelectedProduct(product)}>{product.name}</button>
                          <span>★ {product.rating.toFixed(1)}</span>
                        </div>
                        <p className="product-category">{product.category.toUpperCase()}</p>

                        <div className="product-price-line">
                          <strong>{money(product.price)}</strong>
                          <span className={product.quantity < 5 ? 'low-text' : 'stock-text'}>
                            {product.quantity < 5
                              ? `ONLY ${product.quantity} LEFT`
                              : `${product.quantity} IN STOCK`}
                          </span>
                        </div>

                        <div className="product-actions">
                          <button className="details-button" onClick={() => setSelectedProduct(product)}>
                            DETAILS
                          </button>
                          <button
                            className="add-button"
                            disabled={product.quantity < 1}
                            onClick={() => addToCart(product)}
                          >
                            {product.quantity < 1 ? 'SOLD OUT' : 'ADD TO CART +'}
                          </button>
                        </div>

                        <div className="subtotal">
                          <span>Inventory subtotal</span>
                          <b>{money(product.price * product.quantity)}</b>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="inventory">
                <div>
                  <p className="eyebrow">SHELF CHECK</p>
                  <h3>Current inventory value</h3>
                  <p>Product price multiplied by available stock.</p>
                </div>
                <strong>{money(inventoryTotal)}</strong>
              </div>
            </section>

            <section id="story" className="story">
              <div className="story-number">SB / 001</div>
              <div>
                <p className="eyebrow">A LITTLE ABOUT THE SHOP</p>
                <h2>Not fancy.<br /><em>Just thoughtfully picked.</em></h2>
                <p>
                  SAPATOS NI BOBOY is about dependable footwear for real life:
                  school days, jogging, long walks, and everything in between.
                  Find your pair and make your own story.Sapatos na padi!.
                </p>
                <a href="#collection">FIND YOUR PAIR ↗</a>
              </div>
              <div className="story-stamp">WALK<br />YOUR<br /><b>WAY.</b></div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div>SAPATOS <b>NI BOBOY</b><small>SHOES WITH SOUL.</small></div>
        <span>GOOD PAIRS FOR THE EVERYDAY.</span>
        <span>© 2026 SAPATOS NI BOBOY · STUDENT PROJECT</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <span>✓</span> {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </div>
  )
}

export default App