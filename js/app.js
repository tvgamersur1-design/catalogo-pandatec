/* ==================== PANDA TEC - PREMIUM APP ==================== */

/* ==================== CONFIGURATION ==================== */
const API_BASE_URL = 'https://pandatec.onrender.com/api';
const WHATSAPP_NUMBER = '51902515226';

/* ==================== STATE ==================== */
let allProducts = [];
let categories = [];
let currentFilter = 'all';
let searchQuery = '';
let currentPage = 1;
let totalPages = 1;
const productsPerPage = 12;

let cart = JSON.parse(localStorage.getItem('panda_cart')) || [];

/* ==================== MOBILE MENU ==================== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => navMenu.classList.add('active'));
}

if (navClose) {
    navClose.addEventListener('click', () => navMenu.classList.remove('active'));
}

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Update active link
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

/* ==================== SCROLL EFFECTS ==================== */
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Show scroll to top button
    const scrollUp = document.getElementById('scroll-up');
    if (scrollUp) {
        if (window.scrollY >= 400) {
            scrollUp.style.display = 'flex';
        } else {
            scrollUp.style.display = 'none';
        }
    }
});

// Scroll to top
const scrollUp = document.getElementById('scroll-up');
if (scrollUp) {
    scrollUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==================== CART OPERATIONS ==================== */
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');

if (cartToggle) {
    cartToggle.addEventListener('click', () => cartDrawer.classList.add('active'));
}

if (cartClose) {
    cartClose.addEventListener('click', () => cartDrawer.classList.remove('active'));
}

// Close cart when clicking outside
cartDrawer?.addEventListener('click', (e) => {
    if (e.target === cartDrawer) {
        cartDrawer.classList.remove('active');
    }
});

function saveCart() {
    localStorage.setItem('panda_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const itemIndex = cart.findIndex(item => item._id === product._id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({
            _id: product._id,
            nombre: product.nombre,
            precio: product.precio_venta,
            imagen: product.imagen,
            quantity: 1
        });
    }
    saveCart();
    showNotification(`${product.nombre} añadido al carrito`, 'success');
    cartDrawer.classList.add('active');
}

function removeFromCart(productId) {
    const item = cart.find(i => i._id === productId);
    cart = cart.filter(i => i._id !== productId);
    saveCart();
    if (item) {
        showNotification(`${item.nombre} eliminado del carrito`, 'success');
    }
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(i => i._id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function updateCartUI() {
    const badge = document.getElementById('cart-count');
    const cartBody = document.getElementById('cart-body');
    const totalElement = document.getElementById('cart-total');
    
    // Update badge
    if (badge) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart body
    if (cartBody) {
        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart__empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p class="cart__empty-text">Tu carrito está vacío</p>
                    <p class="cart__empty-subtext">¡Agrega productos para comenzar!</p>
                </div>
            `;
        } else {
            cartBody.innerHTML = `
                <div class="cart__items">
                    ${cart.map(item => `
                        <div class="cart__item">
                            <div class="cart__item-image">
                                <img src="${item.imagen || 'img/placeholder.png'}" alt="${item.nombre}">
                            </div>
                            <div class="cart__item-details">
                                <h4 class="cart__item-name">${item.nombre}</h4>
                                <div class="cart__item-price">S/ ${item.precio.toFixed(2)}</div>
                                <div class="cart__item-controls">
                                    <div class="cart__item-qty">
                                        <button class="cart__qty-btn" onclick="updateQuantity('${item._id}', -1)">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="cart__qty-value">${item.quantity}</span>
                                        <button class="cart__qty-btn" onclick="updateQuantity('${item._id}', 1)">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <button class="cart__item-remove" onclick="removeFromCart('${item._id}')" title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    // Update total
    if (totalElement) {
        const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
        totalElement.textContent = `S/ ${total.toFixed(2)}`;
    }
}

// Checkout
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }
        
        let message = `Hola Panda Tec, me gustaría realizar un pedido:\n\n`;
        let total = 0;
        
        cart.forEach(item => {
            const subtotal = item.precio * item.quantity;
            total += subtotal;
            message += `• ${item.nombre} (x${item.quantity}): S/ ${subtotal.toFixed(2)}\n`;
        });
        
        message += `\n*Total: S/ ${total.toFixed(2)}*`;
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    });
}

/* ==================== NOTIFICATIONS ==================== */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: calc(var(--header-height) + 1rem);
        right: 1.5rem;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ==================== FETCH CATEGORIES ==================== */
async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/categorias/publico`);
        if (res.ok) {
            const allCategories = await res.json();
            
            // Get categories with products
            const productsRes = await fetch(`${API_BASE_URL}/productos/publico?limit=1000`);
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                const categoriesWithProducts = new Set(
                    productsData.productos
                        .map(p => p.categoria_id?._id)
                        .filter(Boolean)
                );
                
                categories = allCategories.filter(cat => categoriesWithProducts.has(cat._id));
            } else {
                categories = allCategories;
            }
            
            renderCategories();
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

function renderCategories() {
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    let html = `<button class="filter__btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>`;
    
    categories.forEach(cat => {
        html += `<button class="filter__btn ${currentFilter === cat._id ? 'active' : ''}" data-filter="${cat._id}">${cat.nombre}</button>`;
    });
    
    container.innerHTML = html;
    
    // Add event listeners
    container.querySelectorAll('.filter__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            fetchProducts();
            
            // Update active state
            container.querySelectorAll('.filter__btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/* ==================== FETCH PRODUCTS ==================== */
async function fetchProducts() {
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    // Show loading
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
            <p style="margin-top: 1rem; color: var(--text-color);">Cargando productos...</p>
        </div>
    `;
    
    try {
        const url = new URL(`${API_BASE_URL}/productos/publico`);
        if (currentFilter !== 'all') url.searchParams.append('categoria', currentFilter);
        if (searchQuery) url.searchParams.append('search', searchQuery);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', productsPerPage);

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            allProducts = data.productos;
            totalPages = data.totalPages;
            currentPage = data.page;
            renderProducts();
            renderPagination();
        } else {
            throw new Error(`HTTP ${res.status}`);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; color: #EF4444; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-color); margin-bottom: 0.5rem;">Error al cargar productos</p>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 1.5rem;">
                    El servidor puede estar iniciándose. Por favor, intenta nuevamente.
                </p>
                <button class="button" onclick="fetchProducts()">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }
}

function renderProducts() {
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    if (allProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-color); font-weight: 600;">No se encontraron productos</p>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">
                    Intenta con otra categoría o búsqueda
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = allProducts.map((product, index) => `
        <article class="product__card">
            ${index < 3 ? '<span class="product__badge product__badge--new">NUEVO</span>' : ''}
            <div class="product__image" onclick="openProductModal(${index})">
                <img src="${product.imagen || 'img/placeholder.png'}" alt="${product.nombre}" loading="lazy">
            </div>
            <div class="product__content">
                <h3 class="product__title">${product.nombre}</h3>
                <div class="product__rating">
                    <span class="product__stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </span>
                    <span class="product__reviews">(4.5)</span>
                </div>
                <div class="product__footer">
                    <span class="product__price">S/ ${product.precio_venta.toFixed(2)}</span>
                    <button class="product__add" onclick="addToCart(allProducts[${index}])" title="Añadir al carrito">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container || totalPages <= 1) {
        if (container) container.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="button ${currentPage === 1 ? 'button--outline' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}
                style="padding: 0.5rem 1rem;">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="button ${currentPage === i ? '' : 'button--outline'}" 
                    onclick="changePage(${i})"
                    style="padding: 0.5rem 1rem; min-width: 40px;">
                ${i}
            </button>
        `;
    }
    
    html += `
        <button class="button ${currentPage === totalPages ? 'button--outline' : ''}" 
                onclick="changePage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}
                style="padding: 0.5rem 1rem;">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = html;
}

function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    fetchProducts();
    window.scrollTo({ top: document.getElementById('catalog').offsetTop - 100, behavior: 'smooth' });
}

/* ==================== PRODUCT MODAL ==================== */
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalAddCart = document.getElementById('modal-add-cart');
let currentProduct = null;

if (modalClose) {
    modalClose.addEventListener('click', closeProductModal);
}

if (modalAddCart) {
    modalAddCart.addEventListener('click', () => {
        if (currentProduct) {
            addToCart(currentProduct);
            closeProductModal();
        }
    });
}

productModal?.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

function openProductModal(index) {
    const product = allProducts[index];
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('modal-title').textContent = product.nombre;
    document.getElementById('modal-category').textContent = product.categoria_id?.nombre || 'General';
    document.getElementById('modal-description').textContent = product.descripcion || 'Sin descripción disponible.';
    document.getElementById('modal-price').textContent = `S/ ${product.precio_venta.toFixed(2)}`;
    document.getElementById('modal-img').src = product.imagen || 'img/placeholder.png';
    document.getElementById('modal-whatsapp').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa: ${product.nombre}`)}`;
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        cartDrawer.classList.remove('active');
    }
});

/* ==================== INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    fetchCategories();
    fetchProducts();
});
