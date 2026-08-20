/* ================= BELLAVIE - Vanilla JavaScript ================= */

const IMG = (id, w = 600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const categories = [
  { label: "OUTERWEAR", title: "KOLEKSI", sub: "BARU", img: IMG("photo-1591047139829-d91aecb6caea") },
  { label: "TAS", title: "DISKON 10%", sub: "Untuk model pilihan", img: IMG("photo-1584917865442-de89df76afd3"), big: true },
  { label: "ATASAN", title: "HOT", sub: "DEALS", img: IMG("photo-1485231183945-fffde7cc051e") },
  { label: "DRESS", title: "HOT", sub: "COLLECTION", img: IMG("photo-1595777457583-95e059d581b8") },
  { label: "ANAK", title: "HOT", sub: "STYLE", img: IMG("photo-1518831959646-742c3a14ebf7") },
];

const products = [
  { id: 1, name: "Pink Ruffle Dress", price: 319000, old: null, tag: "Baru", img: IMG("photo-1515372039744-b8f02a3ae446") },
  { id: 2, name: "Floral Print Top", price: 249000, old: 279000, tag: "Diskon", img: IMG("photo-1483985988355-763728e1935b") },
  { id: 3, name: "White Casual Dress", price: 349000, old: null, tag: "Baru", img: IMG("photo-1502716119720-b23a93e5fe1b") },
  { id: 4, name: "Mustard Top", price: 189000, old: null, tag: "Terlaris", img: IMG("photo-1496747611176-843222e1e57c") },
  { id: 5, name: "Black Sport Bra", price: 319000, old: null, tag: "Terlaris", img: IMG("photo-1571019613454-1cb2f99b2d8b") },
  { id: 6, name: "Ruffle Dress", price: 299000, old: null, tag: "Baru", img: IMG("photo-1487412720507-e7ab37603c6f") },
  { id: 7, name: "Grey Sweatshirt", price: 279000, old: 310000, tag: "Diskon", img: IMG("photo-1556821840-3a63f95609a7") },
  { id: 8, name: "White Top", price: 179000, old: null, tag: "Baru", img: IMG("photo-1485462537746-965f33f7f6a7") },
  { id: 9, name: "Denim Jacket", price: 459000, old: null, tag: "Terlaris", img: IMG("photo-1543087903-1ac2ec7aa8c5") },
  { id: 10, name: "Kemeja Linen Pria", price: 259000, old: 299000, tag: "Diskon", img: IMG("photo-1602810318383-e386cc2a3ccf") },
  { id: 11, name: "Summer Hat Set", price: 149000, old: null, tag: "Baru", img: IMG("photo-1521369909029-2afed882baee") },
  { id: 12, name: "Leather Handbag", price: 599000, old: 750000, tag: "Diskon", img: IMG("photo-1548036328-c9fa89d128fa") },
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

/* ---------- render kategori ---------- */
const catGrid = document.getElementById("catGrid");
catGrid.innerHTML = categories
  .map(
    (c) => `
  <div class="cat ${c.big ? "big" : ""}">
    <div class="cat-info">
      <small>${c.label}</small>
      <h3>${c.title}</h3>
      <p>${c.sub}</p>
      <a href="#produk" class="btn btn-dark">BELANJA</a>
    </div>
    <img src="${c.img}" alt="${c.label}" loading="lazy" />
  </div>`
  )
  .join("");

/* ---------- render produk ---------- */
const grid = document.getElementById("productGrid");
let activeTab = "Semua";
let keyword = "";

function visibleProducts() {
  return products.filter((p) => {
    const okTab = activeTab === "Semua" || p.tag === activeTab;
    const okKey = p.name.toLowerCase().includes(keyword.toLowerCase());
    return okTab && okKey;
  });
}

function renderProducts() {
  const list = visibleProducts();
  if (!list.length) {
    grid.innerHTML = `<p class="empty">Produk tidak ditemukan.</p>`;
    return;
  }
  grid.innerHTML = list
    .map(
      (p) => `
    <div class="card">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.tag !== "Terlaris" ? `<span class="tag ${p.tag === "Diskon" ? "sale" : ""}">${p.tag === "Diskon" ? "-10%" : "NEW"}</span>` : ""}
        <button class="wish ${wishlist.includes(p.id) ? "on" : ""}" data-wish="${p.id}">❤</button>
      </div>
      <div class="card-body">
        <h4>${p.name}</h4>
        <div class="price">${rupiah(p.price)} ${p.old ? `<del>${rupiah(p.old)}</del>` : ""}</div>
        <button class="btn btn-orange add" data-add="${p.id}">+ KERANJANG</button>
      </div>
    </div>`
    )
    .join("");
}

/* ---------- tabs & search ---------- */
document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  activeTab = btn.dataset.tab;
  renderProducts();
});

const searchbar = document.getElementById("searchbar");
document.getElementById("searchBtn").addEventListener("click", () => {
  searchbar.classList.toggle("open");
  if (searchbar.classList.contains("open")) document.getElementById("searchInput").focus();
});
document.getElementById("searchInput").addEventListener("input", (e) => {
  keyword = e.target.value;
  renderProducts();
});

/* ---------- wishlist ---------- */
let wishlist = JSON.parse(localStorage.getItem("bellavie_wish") || "[]");
function saveWish() {
  localStorage.setItem("bellavie_wish", JSON.stringify(wishlist));
  document.getElementById("wishCount").textContent = wishlist.length;
}

/* ---------- cart ---------- */
let cart = JSON.parse(localStorage.getItem("bellavie_cart") || "[]");
const cartBody = document.getElementById("cartBody");

function saveCart() {
  localStorage.setItem("bellavie_cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  if (!cart.length) {
    cartBody.innerHTML = `<p class="empty">Keranjang masih kosong 🛍️</p>`;
  } else {
    cartBody.innerHTML = cart
      .map((i) => {
        const p = products.find((x) => x.id === i.id);
        return `<div class="cart-item">
          <img src="${p.img}" alt="${p.name}" />
          <div>
            <h5>${p.name}</h5>
            <div class="p">${rupiah(p.price)}</div>
            <div class="qty">
              <button data-dec="${p.id}">−</button><span>${i.qty}</span><button data-inc="${p.id}">+</button>
            </div>
          </div>
          <button class="rm" data-rm="${p.id}">✕</button>
        </div>`;
      })
      .join("");
  }
  const total = cart.reduce((s, i) => s + i.qty * products.find((x) => x.id === i.id).price, 0);
  document.getElementById("cartTotal").textContent = rupiah(total);
}

/* ---------- events (delegasi) ---------- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const wish = e.target.closest("[data-wish]");
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rm = e.target.closest("[data-rm]");

  if (add) {
    const id = +add.dataset.add;
    const item = cart.find((i) => i.id === id);
    item ? item.qty++ : cart.push({ id, qty: 1 });
    saveCart();
    toast("Produk ditambahkan ke keranjang");
  }
  if (wish) {
    const id = +wish.dataset.wish;
    wishlist.includes(id) ? (wishlist = wishlist.filter((w) => w !== id)) : wishlist.push(id);
    saveWish();
    renderProducts();
  }
  if (inc) {
    cart.find((i) => i.id === +inc.dataset.inc).qty++;
    saveCart();
  }
  if (dec) {
    const it = cart.find((i) => i.id === +dec.dataset.dec);
    it.qty--;
    if (it.qty <= 0) cart = cart.filter((i) => i.id !== it.id);
    saveCart();
  }
  if (rm) {
    cart = cart.filter((i) => i.id !== +rm.dataset.rm);
    saveCart();
  }
});

/* ---------- drawer ---------- */
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const openCart = () => { cartEl.classList.add("on"); overlay.classList.add("on"); };
const closeCart = () => { cartEl.classList.remove("on"); overlay.classList.remove("on"); };
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Keranjang masih kosong");
  cart = [];
  saveCart();
  closeCart();
  toast("Terima kasih! Pesanan kamu sedang diproses ✅");
});

/* ---------- menu mobile ---------- */
const nav = document.getElementById("nav");
document.getElementById("burger").addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    document.querySelectorAll(".nav a").forEach((a) => a.classList.remove("active"));
    e.target.classList.add("active");
  }
});

/* ---------- newsletter ---------- */
document.getElementById("newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  toast("Berhasil berlangganan newsletter!");
  e.target.reset();
});

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("on"), 2200);
}

/* ---------- init ---------- */
saveWish();
renderProducts();
renderCart();
