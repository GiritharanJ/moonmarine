/* =============================================================
   MOON MARINE — main.js  (FULLY FIXED)
   Fixes:
   1. DOMContentLoaded closure broken (loadGallery/createBubbles called outside)
   2. canvas null crash when contact section not on page
   3. Razorpay → receipt modal with full booking details
   4. PHPMailer fallback via fetch to contact.php
   5. Mobile menu works on all pages
   6. WhatsApp helpers
   7. Rain animation safe-guarded
============================================================= */

/* ── CONFIG — change these ────────────────────────────────── */
const RAZORPAY_KEY  = 'rzp_live_SOFjRPAj8NXqRQ'; // replace with your test key
const BOOKING_AMOUNT = 10000;   // paise — ₹100 advance. Change to suit.
const WA_NUMBER     = '+917708007222';
const CONTACT_PHP   = 'contact.php'; // PHPMailer endpoint

/* =========================================================
   1. DOM READY — mobile menu + gallery + bubbles
========================================================= */
document.addEventListener('DOMContentLoaded', function () {

    /* --- Mobile Menu --- */
    const menuBtn   = document.getElementById('menu-btn');
    const mobileMenu= document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const overlay   = document.getElementById('mobile-overlay');

    if (menuBtn && mobileMenu && closeMenu && overlay) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        closeMenu.addEventListener('click', closeMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);

        // Close when any nav link is clicked
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* --- Gallery (only on pages with #galleryGrid) --- */
    if (document.getElementById('galleryGrid')) {
        loadGallery();
    }

    /* --- Bubbles (only if container exists) --- */
    if (document.getElementById('bubbles')) {
        createBubbles();
    }

    /* --- Rain canvas (only on pages that have it) --- */
    if (document.getElementById('rain-canvas')) {
        initRainCanvas();
    }

    /* --- Footer stars --- */
    if (document.getElementById('footerStars')) {
        createFooterStars();
    }
    if (document.getElementById('starsContainer')) {
        createContactStars();
    }
    if (document.getElementById('rainLayer')) {
        createRainDrops();
    }
    if (document.getElementById('contact')) {
        startRipples();
    }
});

/* =========================================================
   2. WHATSAPP HELPERS
========================================================= */
function sendToWhatsApp(service) {
    var msg = encodeURIComponent(
        'Hello Moon Marine,\n\nI am interested in: ' + service + '\n\nPlease contact me.'
    );
    window.open('https://wa.me/'+917708007222+'?text=' + msg, blank');
}

function sendEngineLead(product) {
    var msg = encodeURIComponent(
        'Hello Moon Marine,\n\nI am interested in: ' + product + '\n\nPlease send details and quotation.'
    );
    window.open('https://wa.me/'+917708007222+'?text=' +msg,blank');
}

/* =========================================================
   3. FORM VALIDATION HELPER
========================================================= */
function validateContactForm() {
    var name    = (document.getElementById('fname')    || {}).value || '';
    var phone   = (document.getElementById('fphone')   || {}).value || '';
    var service = (document.getElementById('fservice') || {}).value || '';

    name  = name.trim();
    phone = phone.trim().replace(/\D/g, ''); // digits only

    if (!name) {
        showFormError('Please enter your full name.');
        return null;
    }
    if (!/^\d{10}$/.test(phone)) {
        showFormError('Please enter a valid 10-digit mobile number.');
        return null;
    }

    return {
        name:     name,
        phone:    phone,
        service:  service || 'Not specified',
        location: ((document.getElementById('flocation') || {}).value) || 'Not specified',
        message:  ((document.getElementById('fmessage')  || {}).value || '').trim() || 'No message'
    };
}

function showFormError(msg) {
    var el = document.getElementById('formError');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(function () { el.style.display = 'none'; }, 4000);
    } else {
        alert(msg);
    }
}

/* =========================================================
   4. RAZORPAY PAYMENT + RECEIPT
========================================================= */
function submitForm() {
    var data = validateContactForm();
    if (!data) return;

    // Check Razorpay SDK loaded
    if (typeof Razorpay === 'undefined') {
        showFormError('Payment system not loaded. Please refresh and try again.');
        return;
    }

    var options = {
        key: "rzp_live_SOFjRPAj8NXqRQ", // your live key
        amount: 1000,                   // ✅ ₹10 = 1000 paise
        currency: "INR",
        name: "Moon Marine Services",
        description: 'Advance Booking: ' + data.service,
        image:       'assets/images/logo.jpeg',
        prefill: {
            name:    data.name,
            contact: data.phone
        },
        notes: {
            service:  data.service,
            location: data.location
        },
        theme: { color: '#4dd9d0' },
        handler: function (response) {
            // Payment success
            showReceipt(data, response.razorpay_payment_id);
            sendBookingEmail(data, response.razorpay_payment_id);
            resetForm();
        },
        modal: {
            ondismiss: function () {
                /* user closed without paying — offer WhatsApp fallback */
                if (confirm('Payment cancelled. Would you like to book via WhatsApp instead?')) {
                    submitWhatsApp();
                }
            }
        }
    };

    try {
        var rzp = new Razorpay(options);
        rzp.on('payment.failed', function (resp) {
            showFormError('Payment failed: ' + resp.error.description);
        });
        rzp.open();
    } catch (e) {
        showFormError('Unable to open payment window. Please try WhatsApp booking.');
    }
}

/* ── Receipt Modal ────────────────────────────────────────── */
function showReceipt(data, paymentId) {
    var modal = document.getElementById('paymentReceipt');
    if (!modal) return;

    var now = new Date();
    var dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
                  ' ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    var amountInr = '₹' + (BOOKING_AMOUNT / 100).toFixed(2);

    document.getElementById('r_payId')    && (document.getElementById('r_payId').textContent    = paymentId);
    document.getElementById('r_name')     && (document.getElementById('r_name').textContent     = data.name);
    document.getElementById('r_phone')    && (document.getElementById('r_phone').textContent    = '+91 ' + data.phone);
    document.getElementById('r_service')  && (document.getElementById('r_service').textContent  = data.service);
    document.getElementById('r_location') && (document.getElementById('r_location').textContent = data.location);
    document.getElementById('r_amount')   && (document.getElementById('r_amount').textContent   = amountInr);
    document.getElementById('r_date')     && (document.getElementById('r_date').textContent     = dateStr);

    modal.classList.add('show');
}

function closeReceipt() {
    var modal = document.getElementById('paymentReceipt');
    if (modal) modal.classList.remove('show');
}

/* ── Send email via PHPMailer (contact.php) ──────────────── */
function sendBookingEmail(data, paymentId) {
    var body = new FormData();
    body.append('name',       data.name);
    body.append('phone',      data.phone);
    body.append('service',    data.service);
    body.append('location',   data.location);
    body.append('message',    data.message);
    body.append('payment_id', paymentId || 'WhatsApp Booking');
    body.append('amount',     '₹' + (BOOKING_AMOUNT / 100));

    fetch(CONTACT_PHP, { method: 'POST', body: body })
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (d.status !== 'success') {
                console.warn('Email note:', d.message);
            }
        })
        .catch(function (e) {
            console.warn('Email send failed (OK locally):', e.message);
        });
}

/* ── Reset form after booking ─────────────────────────────── */
function resetForm() {
    ['fname', 'fphone', 'fservice', 'flocation', 'fmessage'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
    });
}

/* =========================================================
   5. WHATSAPP FORM SUBMIT (no payment)
========================================================= */
function submitWhatsApp() {
    var name     = ((document.getElementById('fname')     || {}).value || 'Customer').trim();
    var phone    = ((document.getElementById('fphone')    || {}).value || '').trim();
    var service  = ((document.getElementById('fservice')  || {}).value || 'General Enquiry');
    var location = ((document.getElementById('flocation') || {}).value || '');
    var message  = ((document.getElementById('fmessage')  || {}).value || '').trim();

    if (!name || name === 'Customer') {
        if (!confirm('Send enquiry without your name?')) return;
    }

    var msg = encodeURIComponent(
        'Hello Moon Marine\n\n' +
        'Name: '     + name     + '\n' +
        'Phone: '    + phone    + '\n' +
        'Service: '  + service  + '\n' +
        'Location: ' + location + '\n' +
        'Message: '  + message  + '\n\n' +
        'Please contact me regarding marine service.'
    );
    window.open('https://wa.me/'+917708007222+'?text=' + msg,blank');
}

/* =========================================================
   6. GALLERY
========================================================= */
function loadGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    var images = [
        { src: 'assets/images/engine-repair.jpeg',   label: 'Engine Repair Job' },
        { src: 'assets/images/mercury-service.png',  label: 'Mercury Service'   },
        { src: 'assets/images/gps-installation.jpeg',label: 'GPS Installation'  },
        { src: 'assets/images/fish-finder.jpeg',     label: 'Fish Finder Setup' },
        { src: 'assets/images/ais-setup.jpeg',       label: 'AIS System'        },
        { src: 'assets/images/spare-parts.png',      label: 'Spare Parts'       },
        { src: 'assets/images/emergency.png',        label: 'Emergency Job'     },
        { src: 'assets/images/installation.jpeg',    label: 'Engine Install'    },
        { src: 'assets/images/electrical.jpeg',      label: 'Electrical Work'   },
        { src: 'assets/images/amc.jpg',              label: 'AMC Service'       }
    ];

    grid.innerHTML = images.map(function (img) {
        return '<div class="gallery-item">' +
            '<img src="' + img.src + '" alt="' + img.label + '" loading="lazy" ' +
            'onerror="this.parentElement.style.background=\'#1a2a5e\';this.style.display=\'none\'">' +
            '<div class="gallery-overlay"><span>' + img.label + '</span></div>' +
            '</div>';
    }).join('');
}

/* =========================================================
   7. BUBBLES
========================================================= */
function createBubbles() {
    var container = document.getElementById('bubbles');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < 14; i++) {
        var b    = document.createElement('div');
        b.className = 'bubble';
        var size = Math.random() * 14 + 4;
        b.style.cssText =
            'width:' + size + 'px; height:' + size + 'px;' +
            'left:' + (Math.random() * 100) + '%;' +
            'bottom:' + (Math.random() * 20) + '%;' +
            'position:fixed;' +
            'animation-duration:' + (Math.random() * 10 + 6) + 's;' +
            'animation-delay:' + (Math.random() * 5) + 's;' +
            'z-index:-1;';
        container.appendChild(b);
    }
}

/* =========================================================
   8. RAIN CANVAS (guarded — only runs if canvas exists)
========================================================= */
function initRainCanvas() {
    var canvas = document.getElementById('rain-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var section = document.getElementById('contact');

    function resizeCanvas() {
        if (!section || !canvas) return;
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* drops */
    var drops = [];
    var NUM_DROPS = 200;

    function createDrop() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            len: Math.random() * 22 + 8,
            speed: Math.random() * 5 + 9,
            opacity: Math.random() * 0.35 + 0.1,
            width: Math.random() < 0.6 ? 1 : 1.5
        };
    }
    for (var i = 0; i < NUM_DROPS; i++) {
        var d = createDrop();
        d.y = Math.random() * canvas.height;
        drops.push(d);
    }

    /* splashes */
    var splashes = [];
    function createSplash(x, y) {
        var count = Math.floor(Math.random() * 4) + 2;
        for (var j = 0; j < count; j++) {
            var angle = Math.random() * Math.PI;
            var speed = Math.random() * 2 + 0.5;
            splashes.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed - 1, life: 1, decay: Math.random() * 0.07 + 0.04, r: Math.random() * 2 + 1 });
        }
    }

    /* lightning */
    var lightningAlpha    = 0;
    var lightningInterval = 0;
    var nextLightning     = Math.random() * 5000 + 3000;
    var flashEl = document.getElementById('lightningFlash');

    function triggerLightning() {
        lightningAlpha = 0.45;
        if (flashEl) {
            flashEl.classList.add('flash');
            setTimeout(function () { flashEl.classList.remove('flash'); }, 80);
            setTimeout(function () {
                if (flashEl) { flashEl.classList.add('flash'); setTimeout(function () { flashEl.classList.remove('flash'); }, 60); }
            }, 160);
        }
        nextLightning = Math.random() * 6000 + 4000;
    }

    function drawLightning() {
        if (lightningAlpha <= 0) return;
        var x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        ctx.strokeStyle = 'rgba(180,230,255,' + lightningAlpha + ')';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(180,230,255,' + lightningAlpha + ')';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        var cx = x, cy = 0;
        ctx.moveTo(cx, cy);
        while (cy < canvas.height * 0.55) {
            cx += (Math.random() - 0.5) * 30;
            cy += Math.random() * 20 + 10;
            ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        lightningAlpha -= 0.05;
    }

    function drawMoon() {
        var mx = canvas.width * 0.78, my = canvas.height * 0.12;
        var grd = ctx.createRadialGradient(mx, my, 0, mx, my, 55);
        grd.addColorStop(0, 'rgba(230,240,255,0.12)');
        grd.addColorStop(1, 'rgba(230,240,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(mx, my, 55, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(220,235,255,0.55)';
        ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(11,21,53,0.6)';
        ctx.beginPath(); ctx.arc(mx + 7, my - 3, 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(220,235,255,0.05)';
        var ry = canvas.height * 0.74;
        for (var k = 0; k < 4; k++) {
            ctx.beginPath();
            ctx.ellipse(mx + (Math.random() - 0.5) * 20, ry + k * 8, 20 - k * 3, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    var lastTime = 0;
    function animate(ts) {
        requestAnimationFrame(animate);
        var dt = Math.min(ts - lastTime, 40);
        lastTime = ts;
        lightningInterval += dt;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMoon();

        ctx.lineCap = 'round';
        drops.forEach(function (dr) {
            ctx.strokeStyle = 'rgba(180,220,255,' + dr.opacity + ')';
            ctx.lineWidth   = dr.width;
            ctx.beginPath();
            ctx.moveTo(dr.x, dr.y);
            ctx.lineTo(dr.x - dr.len * 0.22, dr.y + dr.len);
            ctx.stroke();
            dr.x -= dr.speed * 0.22;
            dr.y += dr.speed;
            if (dr.y > canvas.height * 0.72) {
                createSplash(dr.x, canvas.height * 0.72);
                Object.assign(dr, createDrop());
            }
        });

        for (var si = splashes.length - 1; si >= 0; si--) {
            var s = splashes[si];
            ctx.fillStyle = 'rgba(180,220,255,' + (s.life * 0.5) + ')';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= s.decay;
            if (s.life <= 0) splashes.splice(si, 1);
        }

        if (lightningInterval >= nextLightning) {
            triggerLightning();
            lightningInterval = 0;
        }
        drawLightning();
    }
    requestAnimationFrame(animate);
}

/* CSS rain drops */
function createRainDrops() {
    var rl = document.getElementById('rainLayer');
    if (!rl) return;
    rl.innerHTML = '';
    for (var i = 0; i < 60; i++) {
        var d = document.createElement('div');
        d.className = 'rain-drop';
        var h = Math.random() * 25 + 12;
        d.style.cssText =
            'left:' + (Math.random() * 100) + '%;' +
            'height:' + h + 'px;' +
            'animation-duration:' + (Math.random() * 0.6 + 0.6) + 's;' +
            'animation-delay:' + (Math.random() * 2) + 's;' +
            'opacity:' + (Math.random() * 0.4 + 0.1) + ';';
        rl.appendChild(d);
    }
}

/* Water ripples */
function startRipples() {
    var section = document.getElementById('contact');
    if (!section) return;
    setInterval(function () {
        var r    = document.createElement('div');
        r.className = 'ripple';
        var size = Math.random() * 60 + 20;
        r.style.cssText =
            'left:' + (Math.random() * 90 + 5) + '%;' +
            'width:' + size + 'px; height:' + (size * 0.35) + 'px;' +
            'animation-duration:' + (Math.random() * 2 + 1.5) + 's;' +
            'z-index:2; pointer-events:none;';
        section.appendChild(r);
        setTimeout(function () { r.remove(); }, 4000);
    }, 400);
}

/* Stars in contact section */
function createContactStars() {
    var sc = document.getElementById('starsContainer');
    if (!sc) return;
    sc.innerHTML = '';
    for (var i = 0; i < 55; i++) {
        var s = document.createElement('div');
        s.className = 'star';
        var sz = Math.random() * 2 + 0.8;
        s.style.cssText =
            'width:' + sz + 'px; height:' + sz + 'px;' +
            'top:' + (Math.random() * 55) + '%;' +
            'left:' + (Math.random() * 100) + '%;' +
            'animation-duration:' + (Math.random() * 3 + 2) + 's;' +
            'animation-delay:' + (Math.random() * 4) + 's;';
        sc.appendChild(s);
    }
}

/* Stars in footer */
function createFooterStars() {
    var fs = document.getElementById('footerStars');
    if (!fs) return;
    fs.innerHTML = '';
    for (var i = 0; i < 30; i++) {
        var s = document.createElement('div');
        s.className = 'star';
        var sz = Math.random() * 2 + 0.5;
        s.style.cssText =
            'width:' + sz + 'px; height:' + sz + 'px;' +
            'top:' + (Math.random() * 100) + '%;' +
            'left:' + (Math.random() * 100) + '%;' +
            'animation-duration:' + (Math.random() * 4 + 2) + 's;' +
            'animation-delay:' + (Math.random() * 5) + 's;';
        fs.appendChild(s);
    }
}
