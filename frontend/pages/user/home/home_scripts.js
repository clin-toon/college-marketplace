/**
 * College Marketplace — Dashboard Logic
 */

(() => {
  "use strict";

  const grid = document.getElementById("listings-grid");
  const statusEl = document.getElementById("listings-status");
  
  const filterCat = document.getElementById("filter-category");
  const filterMinPrice = document.getElementById("filter-min-price");
  const filterMaxPrice = document.getElementById("filter-max-price");
  const filterSort = document.getElementById("filter-sort");
  const applyBtn = document.getElementById("apply-filters-btn");

  let allProducts = [];

  // --- API FETCH ---
  async function loadListings() {
    showStatus("Loading marketplace items...");

    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      allProducts = data.products;

      // Adjust generic prices to realistic Nepali Rupee values
      allProducts = allProducts.map(p => ({
        ...p,
        price: p.price * 130
      }));

      // Custom items with realistic NPR pricing
      allProducts.unshift(
        {
          id: 9991,
          title: "Organic Chemistry Textbook",
          description: "Required for CHEM 201. Lightly used, no annotations inside.",
          price: 1200,
          category: "books",
          thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"
        },
        {
          id: 9992,
          title: "TI-84 Calculator",
          description: "Essential for engineering & math courses. Works perfectly.",
          price: 4500,
          category: "electronics",
          thumbnail: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=400&auto=format&fit=crop"
        },
        {
          id: 9993,
          title: "MacBook Air M1 (2021)",
          description: "8GB RAM, 256GB SSD. Battery health 92%. Includes charger.",
          price: 85000,
          category: "electronics",
          thumbnail: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop"
        }
      );

      populateCategories(allProducts);
      applyFiltersAndRender();
    } catch (error) {
      console.error("Error loading products:", error);
      showStatus("Could not load products. Please refresh the page.", true);
    }
  }

  // --- POPULATE CATEGORIES ---
  function populateCategories(products) {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ");
      filterCat.appendChild(option);
    });
  }

  // --- FILTER & SORT LOGIC ---
  function applyFiltersAndRender() {
    const category = filterCat.value;
    const minP = parseFloat(filterMinPrice.value) || 0;
    const maxP = parseFloat(filterMaxPrice.value) || Infinity;
    const sortVal = filterSort.value;

    let filtered = allProducts.filter(item => {
      const matchCategory = category === "all" || item.category === category;
      const matchPrice = item.price >= minP && item.price <= maxP;
      return matchCategory && matchPrice;
    });

    filtered.sort((a, b) => {
      switch (sortVal) {
        case "latest": return b.id - a.id;
        case "oldest": return a.id - b.id;
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "a-z": return a.title.localeCompare(b.title);
        case "z-a": return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    renderListings(filtered);
  }

  // --- CARD RENDERER ---
  function createListingCard(item) {
    const article = document.createElement("article");
    article.className = "flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeSlideIn";

    // Image & Price Badge
    const imgContainer = document.createElement("div");
    imgContainer.className = "relative h-48 w-full bg-slate-100 p-4";

    const img = document.createElement("img");
    img.src = item.thumbnail;
    img.alt = item.title;
    img.className = "h-full w-full object-contain drop-shadow-sm";

    const priceBadge = document.createElement("div");
    priceBadge.className = "absolute top-3 right-3 rounded-lg bg-sky-500 px-3 py-1 font-display text-sm font-bold text-white shadow-md";
    priceBadge.textContent = `Rs ${item.price.toLocaleString("en-IN")}`;

    imgContainer.append(img, priceBadge);

    // Card Details
    const body = document.createElement("div");
    body.className = "flex flex-1 flex-col p-5";

    const catLabel = document.createElement("p");
    catLabel.className = "font-body text-xs font-bold text-indigo-600 uppercase tracking-wider";
    catLabel.textContent = item.category.replace("-", " ");

    // Product Title in Black
    const titleEl = document.createElement("h3");
    titleEl.className = "mt-2 font-display text-lg font-bold text-black line-clamp-1";
    titleEl.textContent = item.title;

    const descEl = document.createElement("p");
    descEl.className = "mt-2 mb-4 flex-1 font-body text-sm text-slate-500 line-clamp-2";
    descEl.textContent = item.description;

    const cartBtn = document.createElement("button");
    cartBtn.className = "mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-body text-sm font-bold text-white transition hover:bg-primaryHover active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50";
    cartBtn.innerHTML = `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Add to Cart
    `;

    cartBtn.addEventListener("click", () => {
      alert(`Added "${item.title}" to your cart!`);
    });

    body.append(catLabel, titleEl, descEl, cartBtn);
    article.append(imgContainer, body);
    return article;
  }

  function renderListings(listings) {
    grid.innerHTML = "";
    if (!listings.length) {
      showStatus("No items match your filter criteria.");
      return;
    }
    hideStatus();
    listings.forEach(item => grid.appendChild(createListingCard(item)));
  }

  function showStatus(message, isError = false) {
    grid.classList.add("hidden");
    statusEl.textContent = message;
    statusEl.className = `mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center font-body text-sm ${
      isError ? "text-danger" : "text-slate-500"
    }`;
    statusEl.classList.remove("hidden");
  }

  function hideStatus() {
    statusEl.classList.add("hidden");
    grid.classList.remove("hidden");
  }

  // --- EVENTS ---
  applyBtn.addEventListener("click", applyFiltersAndRender);

  loadListings();
})();