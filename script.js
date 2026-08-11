// ================================================================
// 1. إعدادات التواصل
// ================================================================
const STORE_EMAIL = 'utopia_trade26@yahoo.com';
const WHATSAPP_NUMBER = '201061007100';
const STORE_NAME = 'يوتوبيا للتجارة والتصدير';

// ================================================================
// 2. منع النقر الأيمن
// ================================================================
document.addEventListener('contextmenu', e => e.preventDefault());

// ================================================================
// 3. بيانات المنتجات
// ================================================================
const productsData = [
    { id: 1, cat: 'paddle-flanges', nameAr: 'بادل فلانش استانلس ستيل', nameEn: 'Paddle Flange SS', price: 120.00, img: 'https://i.postimg.cc/wxFssk36/badl-flansh-astanls-styl.png', descAr: 'مقاومة عالية للتآكل.', descEn: 'High corrosion resistance.' },
    { id: 2, cat: 'paddle-flanges', nameAr: 'بادل فلانش مجلفن', nameEn: 'Galvanized Paddle Flange', price: 90.00, img: 'https://i.postimg.cc/MGvYsKrT/badl-flansh-mjlfn.jpg', descAr: 'طبقة جلفنة ساخنة.', descEn: 'Hot-dip galvanized.' },
    { id: 3, cat: 'flanges', nameAr: 'فلانشات لحام رقبة', nameEn: 'Weld Neck Flanges', price: 150.00, img: 'https://i.postimg.cc/3RPkBL57/66606066.png', descAr: 'توزيع الضغط بكفاءة.', descEn: 'High pressure systems.' },
    { id: 4, cat: 'fire', nameAr: 'هويات وموانع دوامة', nameEn: 'Vortex Breakers & Hoods', price: 250.00, img: 'https://i.postimg.cc/9fnwnX5K/Whats-App-Image-2026-04-26-at-15-45-40.jpg', descAr: 'منع الدوامات الهوائية.', descEn: 'Prevents vortex formation.' },
    { id: 5, cat: 'fittings', nameAr: 'قطع قلاووظ مجلفنة', nameEn: 'Galvanized Threaded Fittings', price: 25.00, img: 'https://i.postimg.cc/RhvspTzG/9999999999999.png', descAr: 'كوع وتايوان عالي الجودة.', descEn: 'High quality elbows.' },
    { id: 6, cat: 'fittings', nameAr: 'قطع قلاووظ استانلس', nameEn: 'SS Threaded Fittings', price: 45.00, img: 'https://i.postimg.cc/J4kDdCPG/pro621-x660.jpg', descAr: 'مقاوم للأحماض (304/316).', descEn: 'Acid resistant (304/316).' },
    { id: 7, cat: 'pipes', nameAr: 'مواسير استانلس دوبلكس', nameEn: 'Duplex SS Pipe Fittings', price: 320.00, img: 'https://i.postimg.cc/cHCGkZMx/465324651321.png', descAr: 'مقاومة للتشقق الإجهادي.', descEn: 'Stress corrosion resistant.' },
    { id: 8, cat: 'pipes', nameAr: 'مواسير سيملس', nameEn: 'Seamless Pipes', price: 180.00, img: 'https://i.postimg.cc/SsnN2cPY/33333333.png', descAr: 'بدون لحام، جميع الجداول.', descEn: 'Seamless, all schedules.' }
];

let cart = [];
let lastOrderId = null; // لتخزين رقم آخر طلب للتتبع

// ================================================================
// 4. عرض المنتجات
// ================================================================
function renderProducts(category = 'all', searchQuery = '') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    let filtered = productsData.filter(p => {
        const matchCat = (category === 'all' || p.cat === category);
        const matchSearch = p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    if(filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 30px;">عذراً، لم نجد منتجات تطابق بحثك.</p>`;
        return;
    }
    
    filtered.forEach(p => {
        let catTextAr = 'أخرى';
        if(p.cat === 'pipes') catTextAr = 'مواسير سيملس ';
        else if(p.cat === 'paddle-flanges') catTextAr = 'بادل فلانش';
        else if(p.cat === 'flanges') catTextAr = 'فلانشات';
        else if(p.cat === 'fittings') catTextAr = 'قطع قلاووظ';
        else if(p.cat === 'fire') catTextAr = 'هويات وموانع دوامة';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="img-box"><img src="${p.img}" alt="${p.nameEn}" loading="lazy"></div>
            <div class="p-info">
                <h3><span class="lang-ar">${p.nameAr}</span><span class="lang-en">${p.nameEn}</span></h3>
                <span class="tag"><span class="lang-ar">${catTextAr}</span><span class="lang-en">${p.cat}</span></span>
                <p><span class="lang-ar">${p.descAr}</span><span class="lang-en">${p.descEn}</span></p>
                <span class="p-price">$${p.price.toFixed(2)}</span>
                <button class="add-cart-btn" onclick="addToCart(${p.id})"><span class="lang-ar">أضف إلى السلة</span><span class="lang-en">Add to Cart</span></button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat, event) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    renderProducts(cat, document.getElementById('searchInput').value);
}
function handleSearch() { renderProducts('all', document.getElementById('searchInput').value); }

// ================================================================
// 5. وظائف السلة
// ================================================================
function addToCart(id) {
    const item = productsData.find(p => p.id === id);
    const exist = cart.find(p => p.id === id);
    if(exist) exist.quantity++; else cart.push({...item, quantity: 1});
    updateCartUI(); openCart();
}
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotalPrice');
    const countEl = document.getElementById('cartCount');
    container.innerHTML = '';
    let total = 0, count = 0;
    cart.forEach((item, i) => {
        total += item.price * item.quantity; count += item.quantity;
        const name = document.body.classList.contains('dir-ltr') ? item.nameEn : item.nameAr;
        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info"><h4>${name}</h4><small>$${item.price.toFixed(2)}</small></div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty(${i}, -1)">-</button> ${item.quantity}
                    <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
                    <span class="remove-item" onclick="removeItem(${i})">×</span>
                </div>
            </div>`;
    });
    if(cart.length===0) container.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;"><span class="lang-ar">السلة فارغة</span><span class="lang-en">Cart is empty</span></p>`;
    totalEl.innerText = `$${total.toFixed(2)}`;
    countEl.innerText = count;
}
function changeQty(i, c) { if(cart[i].quantity + c > 0) cart[i].quantity += c; else removeItem(i); updateCartUI(); }
function removeItem(i) { cart.splice(i, 1); updateCartUI(); }
function openCart() { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('overlay').classList.add('active'); }
function closeCart() { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('active'); }

// ================================================================
// 6. فتح وإغلاق النماذج
// ================================================================
function openCheckoutModal() {
    if(cart.length === 0) return alert("السلة فارغة برجاء اختيار المنتجات أولاً");
    document.getElementById('checkoutModal').classList.add('active');
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}
function closeCheckoutModal() { document.getElementById('checkoutModal').classList.remove('active'); }

// ================================================================
// 7. الموقع الجغرافي
// ================================================================
function getUserLocation() {
    const locationInput = document.getElementById('custLocation');
    if (navigator.geolocation) {
        locationInput.value = "جاري الحصول على الموقع...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude; const lng = position.coords.longitude;
                locationInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
            },
            (error) => { locationInput.value = "تعذر الحصول على الموقع."; alert("يرجى السماح بالوصول للموقع أو كتابته يدوياً."); }
        );
    } else { locationInput.value = "المتصفح لا يدعم تحديد الموقع."; }
}

// ================================================================
// 8. حفظ الطلب في LocalStorage (مع نظام التتبع)
// ================================================================
function saveOrderToLocalStorage(orderData) {
    let orders = JSON.parse(localStorage.getItem('utopia_orders') || '[]');
    // إضافة حالات التتبع
    orderData.tracking = {
        status: 'قيد التجهيز', // الحالة الافتراضية
        lastUpdate: new Date().toLocaleString('ar-EG'),
        history: ['تم استلام الطلب بنجاح']
    };
    orders.push(orderData);
    localStorage.setItem('utopia_orders', JSON.stringify(orders));
    lastOrderId = orderData.id;
}

// ================================================================
// 9. بناء بيانات الطلب (تم تحديثه ليشمل طريقة الدفع)
// ================================================================
function buildOrderData() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const location = document.getElementById('custLocation').value.trim() || "لم يتم التحديد";
    const method = document.getElementById('deliveryMethod').value;
    const payment = document.getElementById('paymentMethod').value; // 🔴 جديد

    if(!name || !phone || !address) { alert("برجاء إكمال جميع الحقول المطلوبة"); return null; }
    let total = cart.reduce((t, i) => t + (i.price * i.quantity), 0);
    return {
        id: Date.now(),
        date: new Date().toLocaleString('ar-EG'),
        name, phone, address, location, method, payment, // 🔴 payment
        items: JSON.parse(JSON.stringify(cart)),
        total: total
    };
}

// ================================================================
// 10. 📧 إرسال بالإيميل (تم تحديثه ليشمل طريقة الدفع)
// ================================================================
function submitOrderViaEmail() {
    const orderData = buildOrderData();
    if(!orderData) return;
    saveOrderToLocalStorage(orderData);

    let productsList = "";
    orderData.items.forEach((item, i) => { productsList += `${i + 1}. ${item.nameAr} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}%0A`; });

    const subject = `طلب جديد #${orderData.id} - ${STORE_NAME}`;
    const body = 
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A📍 ${STORE_NAME} - طلب شراء جديد 📍%0A━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `📋 رقم الطلب : ${orderData.id}%0A🕐 التاريخ    : ${orderData.date}%0A━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `👤 بيانات العميل:%0A▸ الاسم   : ${orderData.name}%0A▸ الهاتف  : ${orderData.phone}%0A▸ العنوان : ${orderData.address}%0A▸ اللوكيشن: ${orderData.location}%0A▸ طريقة الاستلام: ${orderData.method}%0A▸ طريقة الدفع: ${orderData.payment}%0A%0A` + // 🔴 تم إضافة الدفع
        `🛒 تفاصيل المنتجات:%0A━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A${productsList}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `💰 الإجمالي النهائي: $${orderData.total.toFixed(2)}%0A%0A━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0Aشكراً لتسوقكم ${STORE_NAME} 🔥%0A━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    window.open(`mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
    showSuccessWithTracking();
}

// ================================================================
// 11. 💬 إرسال بالواتساب (تم تحديثه ليشمل طريقة الدفع)
// ================================================================
function submitOrderViaWhatsApp() {
    const orderData = buildOrderData();
    if(!orderData) return;
    saveOrderToLocalStorage(orderData);

    let productsList = "";
    orderData.items.forEach((item, i) => { productsList += `${i + 1}. ${item.nameAr} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`; });

    const message = 
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📍 ${STORE_NAME} - طلب شراء جديد 📍\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `📋 رقم الطلب : ${orderData.id}\n🕐 التاريخ    : ${orderData.date}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 بيانات العميل:\n▸ الاسم   : ${orderData.name}\n▸ الهاتف  : ${orderData.phone}\n▸ العنوان : ${orderData.address}\n▸ اللوكيشن: ${orderData.location}\n▸ طريقة الاستلام: ${orderData.method}\n▸ طريقة الدفع: ${orderData.payment}\n\n` + // 🔴 تم إضافة الدفع
        `🛒 تفاصيل المنتجات:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${productsList}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `💰 الإجمالي النهائي: $${orderData.total.toFixed(2)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nشكراً لتسوقكم ${STORE_NAME} 🔥\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    showSuccessWithTracking();
}

// ================================================================
// 12. 🔴 نظام التتبع (للعميل الخاص / زر الطلب)
// ================================================================
function showSuccessWithTracking() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    cart = []; updateCartUI();
}

function openTracking() {
    closeCheckoutModal();
    document.getElementById('trackingModal').classList.add('active');
    loadTrackingDataById(lastOrderId);
}

function closeTracking() {
    document.getElementById('trackingModal').classList.remove('active');
}

// دالة عامة لعرض التتبع (تستخدم للزر الخاص ولقائمة البحث العامة)
function loadTrackingDataById(orderId) {
    const container = document.getElementById('trackingContent');
    const orders = JSON.parse(localStorage.getItem('utopia_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if(!order) {
        container.innerHTML = `<p style="text-align: center; color: #e74c3c;">عذراً، لم نتمكن من العثور على هذا الطلب.</p>`;
        return;
    }

    // محاكاة رحلة الشحنة والوقت
    const orderDate = new Date(order.date);
    const currentDate = new Date();
    const diffDays = Math.ceil((currentDate - orderDate) / (1000 * 60 * 60 * 24));
    let remainingTime = "";
    let progressColor = "#f39c12";
    let journey = "";

    if (diffDays === 0) {
        remainingTime = "جاري التجهيز (سيتم الشحن خلال 24 ساعة)";
        progressColor = "#3498db";
        journey = `📍 <strong>المرحلة الحالية:</strong> الطلب قيد المراجعة في مخازن ${STORE_NAME}.`;
    } else if (diffDays <= 2) {
        remainingTime = `الشحنة في الطريق، متبقي حوالي ${4 - diffDays} أيام للتسليم.`;
        progressColor = "#f1c40f";
        journey = `🚚 <strong>المرحلة الحالية:</strong> تم الشحن من المستودع، الشحنة في طريقها لمحطة التوزيع.`;
    } else if (diffDays <= 4) {
        remainingTime = `الشحنة قاربت على الوصول، متبقي يوم واحد فقط!`;
        progressColor = "#2ecc71";
        journey = `📦 <strong>المرحلة الحالية:</strong> الشحنة وصلت لمحطة التوزيع الرئيسية، جاري التجهيز للتسليم النهائي.`;
    } else {
        remainingTime = "تم التسليم بنجاح ✓";
        progressColor = "#27ae60";
        journey = `✅ <strong>المرحلة الحالية:</strong> تم تسليم الشحنة للعميل بنجاح.`;
    }

    container.innerHTML = `
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-top: 10px;">
            <p style="font-size: 14px; color: #777; margin-bottom: 10px;"><strong>رقم التتبع:</strong> #${order.id}</p>
            <p style="font-size: 14px; color: #777; margin-bottom: 20px;"><strong>اسم العميل:</strong> ${order.name}</p>
            
            <div style="background: white; border: 2px solid ${progressColor}; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 15px;">
                <h3 style="color: ${progressColor}; margin: 0;">${order.tracking.status}</h3>
            </div>
            
            <div style="background: #fff; border-radius: 8px; padding: 15px; border: 1px solid #eee; margin-bottom: 15px;">
                <h4 style="color: #0a1e2d; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">🕒 الوقت المتوقع للتسليم</h4>
                <p style="font-size: 16px; color: #333; font-weight: bold;">${remainingTime}</p>
            </div>

            <div style="background: #fff; border-radius: 8px; padding: 15px; border: 1px solid #eee;">
                <h4 style="color: #0a1e2d; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">🗺️ رحلة الشحنة (راحت فين ووصلت فين)</h4>
                <p style="font-size: 15px; color: #333;">${journey}</p>
            </div>
        </div>
    `;
}

// ================================================================
// 13. 🔴 قائمة البحث العامة
// ================================================================
function searchPublicTracking() {
    const input = document.getElementById('publicTrackingInput').value.trim();
    const resultContainer = document.getElementById('publicTrackingResult');
    
    if(!input) {
        resultContainer.innerHTML = `<p style="color: #e74c3c; text-align: center;">يرجى إدخال رقم التتبع أولاً.</p>`;
        return;
    }

    const searchId = Number(input);
    if(isNaN(searchId)) {
        resultContainer.innerHTML = `<p style="color: #e74c3c; text-align: center;">رقم التتبع غير صحيح، يرجى إدخال أرقام فقط.</p>`;
        return;
    }

    const orders = JSON.parse(localStorage.getItem('utopia_orders') || '[]');
    const order = orders.find(o => o.id === searchId);

    if(!order) {
        resultContainer.innerHTML = `<p style="color: #e74c3c; text-align: center;">عذراً، لا يوجد شحنة بهذا الرقم.</p>`;
        return;
    }

    // عرض النتيجة
    const orderDate = new Date(order.date);
    const currentDate = new Date();
    const diffDays = Math.ceil((currentDate - orderDate) / (1000 * 60 * 60 * 24));
    let remainingTime = "", progressColor = "#f39c12", journey = "";

    if (diffDays === 0) {
        remainingTime = "جاري التجهيز (سيتم الشحن خلال 24 ساعة)";
        progressColor = "#3498db";
        journey = `📍 <strong>المرحلة الحالية:</strong> الطلب قيد المراجعة في مخازن ${STORE_NAME}.`;
    } else if (diffDays <= 2) {
        remainingTime = `الشحنة في الطريق، متبقي حوالي ${4 - diffDays} أيام للتسليم.`;
        progressColor = "#f1c40f";
        journey = `🚚 <strong>المرحلة الحالية:</strong> تم الشحن من المستودع، الشحنة في طريقها لمحطة التوزيع.`;
    } else if (diffDays <= 4) {
        remainingTime = `الشحنة قاربت على الوصول، متبقي يوم واحد فقط!`;
        progressColor = "#2ecc71";
        journey = `📦 <strong>المرحلة الحالية:</strong> الشحنة وصلت لمحطة التوزيع الرئيسية، جاري التجهيز للتسليم النهائي.`;
    } else {
        remainingTime = "تم التسليم بنجاح ✓";
        progressColor = "#27ae60";
        journey = `✅ <strong>المرحلة الحالية:</strong> تم تسليم الشحنة للعميل بنجاح.`;
    }

    resultContainer.innerHTML = `
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-top: 15px; border: 1px solid #ddd;">
            <p style="font-size: 14px; color: #777; margin-bottom: 5px;"><strong>رقم التتبع:</strong> #${order.id}</p>
            <p style="font-size: 14px; color: #777; margin-bottom: 15px;"><strong>اسم العميل:</strong> ${order.name}</p>
            
            <div style="background: white; border: 2px solid ${progressColor}; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 15px;">
                <h3 style="color: ${progressColor}; margin: 0;">${order.tracking.status}</h3>
            </div>
            
            <div style="background: #fff; border-radius: 8px; padding: 15px; border: 1px solid #eee; margin-bottom: 15px;">
                <h4 style="color: #0a1e2d; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">🕒 الوقت المتوقع للتسليم</h4>
                <p style="font-size: 16px; color: #333; font-weight: bold;">${remainingTime}</p>
            </div>

            <div style="background: #fff; border-radius: 8px; padding: 15px; border: 1px solid #eee;">
                <h4 style="color: #0a1e2d; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">🗺️ رحلة الشحنة (راحت فين ووصلت فين)</h4>
                <p style="font-size: 15px; color: #333;">${journey}</p>
            </div>
        </div>
    `;
}

// ================================================================
// 14. لوحة التحكم اجمالى الطلبات والمبيعات (للأدمين مع إمكانية تحديث الحالة وعرض طريقة الدفع)
// ================================================================
function toggleAdmin() {
    const modal = document.getElementById('adminModal');
    modal.classList.toggle('active');
    if(modal.classList.contains('active')) loadAdminOrders();
}

function closeAdmin() { document.getElementById('adminModal').classList.remove('active'); }

function loadAdminOrders() {
    const container = document.getElementById('adminOrdersContainer');
    const orders = JSON.parse(localStorage.getItem('utopia_orders') || '[]');
    if(orders.length === 0) { 
        container.innerHTML = `<p style="text-align:center; color:#999;">لا توجد طلبات حتى الآن.</p>`; 
        return; 
    }
    
    container.innerHTML = '';
    orders.reverse().forEach((order, index) => {
        let itemsHtml = `<ul>`;
        if(order.items && order.items.length > 0) {
            order.items.forEach(item => { 
                itemsHtml += `<li>${item.nameAr || item.nameEn || 'منتج'} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`; 
            });
        }
        itemsHtml += `</ul>`;

        container.innerHTML += `
            <div class="order-card">
                <h3>طلب #${order.id}</h3>
                <p><strong>التاريخ:</strong> ${order.date}</p>
                <p><strong>العميل:</strong> ${order.name}</p>
                <p><strong>الهاتف:</strong> ${order.phone}</p>
                <p><strong>العنوان:</strong> ${order.address}</p>
                <p><strong>اللوكيشن:</strong> ${order.location || 'لم يحدد'}</p>
                <p><strong>طريقة الاستلام:</strong> ${order.method}</p>
                <p><strong>طريقة الدفع:</strong> ${order.payment || 'لم يحدد'}</p> <!-- 🔴 عرض طريقة الدفع -->
                ${itemsHtml}
                <div class="order-total">الإجمالي: $${order.total.toFixed(2)}</div>
                
                <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
                    <label style="font-weight: bold; color: #333; display: block; margin-bottom: 5px;">تحديث حالة الشحنة:</label>
                    <select class="admin-status-select" id="status_${index}" onchange="updateOrderStatus(${index}, this.value)">
                        <option value="قيد التجهيز" ${order.tracking && order.tracking.status === 'قيد التجهيز' ? 'selected' : ''}>قيد التجهيز</option>
                        <option value="تم الشحن" ${order.tracking && order.tracking.status === 'تم الشحن' ? 'selected' : ''}>تم الشحن</option>
                        <option value="في الطريق" ${order.tracking && order.tracking.status === 'في الطريق' ? 'selected' : ''}>في الطريق</option>
                        <option value="تم التسليم" ${order.tracking && order.tracking.status === 'تم التسليم' ? 'selected' : ''}>تم التسليم</option>
                    </select>
                </div>
            </div>
        `;
    });
}

function updateOrderStatus(index, newStatus) {
    let orders = JSON.parse(localStorage.getItem('utopia_orders') || '[]');
    const realIndex = orders.length - 1 - index;
    if(orders[realIndex]) {
        orders[realIndex].tracking.status = newStatus;
        orders[realIndex].tracking.lastUpdate = new Date().toLocaleString('ar-EG');
        localStorage.setItem('utopia_orders', JSON.stringify(orders));
        alert("✅ تم تحديث حالة الشحنة بنجاح!");
        loadAdminOrders();
    }
}

// ================================================================
// 15. وظائف عامة
// ================================================================
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') !== null) { document.getElementById('adminBtn').style.display = 'block'; }
}
function toggleLang() { document.body.classList.toggle('dir-ltr'); updateCartUI(); }

// ================================================================
// 16. تهيئة المتجر
// ================================================================
renderProducts();
checkAdminAccess();
updateCartUI();