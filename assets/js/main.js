// ===== MOON MARINE MAIN JS =====

// ===== MOBILE MENU =====
document.addEventListener("DOMContentLoaded", function () {

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("mobile-overlay");

if(!menuBtn || !mobileMenu || !closeMenu || !overlay){
console.error("Mobile menu elements missing");
return;
}

menuBtn.addEventListener("click", function(){
mobileMenu.classList.add("open");
overlay.classList.add("open");
document.body.style.overflow="hidden";
});

function closeMenuFunc(){
mobileMenu.classList.remove("open");
overlay.classList.remove("open");
document.body.style.overflow="";
}

closeMenu.addEventListener("click", closeMenuFunc);
overlay.addEventListener("click", closeMenuFunc);

document.querySelectorAll("#mobile-menu a").forEach(link=>{
link.addEventListener("click", closeMenuFunc);
});

});

    // Initialize gallery and bubbles
    loadGallery();
    createBubbles();
});

// ===== WHATSAPP FUNCTIONS =====
function sendToWhatsApp(service) {
    const msg = encodeURIComponent(
        `Hello Moon Marine,\n\nI am interested in: ${service}\n\nPlease contact me.`
    );
    window.open(`https://wa.me/917708007222?text=${msg}`, "_blank");
}

function sendEngineLead(product) {
    const msg = encodeURIComponent(
        `Hello Moon Marine,\n\nI am interested in: ${product}\n\nPlease send details and quotation.`
    );
    window.open(`https://wa.me/917708007222?text=${msg}`, "_blank");
}

// ===== CONTACT FORM WITH RAZORPAY PAYMENT =====
function submitForm() {
    const name = document.getElementById("fname")?.value.trim();
    const phone = document.getElementById("fphone")?.value.trim();
    const service = document.getElementById("fservice")?.value;
    const location = document.getElementById("flocation")?.value;
    const message = document.getElementById("fmessage")?.value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    var options = {
        key: "rzp_live_SOFjRPAj8NXqRQ", // your live key
        amount: 1000,                   // ✅ ₹10 = 1000 paise
        currency: "INR",
        name: "Moon Marine Services",
        description: "Advance Service Booking",
        prefill: { name: name, contact: phone },
        handler: function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            sendBookingEmail(name, phone, service, location, message, response.razorpay_payment_id);
        },
        modal: { ondismiss: function () { alert("Payment cancelled."); } }
    };

    var rzp = new Razorpay(options);
    rzp.open();
}

// ===== SEND BOOKING EMAIL VIA FORMSUBMIT =====
function sendBookingEmail(name, phone, service, location, message, paymentId) {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("service", service || "Not specified");
    formData.append("location", location || "Not specified");
    formData.append("message", message || "No message");
    formData.append("payment_id", paymentId);
    formData.append("_subject", "💰 New Moon Marine Booking - Payment Received"); // underscore
    formData.append("_captcha", "false"); // underscore

    fetch("https://formsubmit.co/ajax/moonmarineinvocationcomunicati@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Booking confirmed! We will contact you soon.");

        // Reset form – use correct IDs with 'f' prefix
        document.getElementById("fname").value = "";
        document.getElementById("fphone").value = "";
        document.getElementById("fservice").value = "";
        document.getElementById("flocation").value = "";
        document.getElementById("fmessage").value = "";
    })
    .catch(error => {
        console.error("Email error:", error);
        alert("Payment successful but email confirmation failed. We have your details and will contact you.");
    });
}

// ===== WHATSAPP FORM (without payment) =====
function submitWhatsApp() {
    const name = document.getElementById("fname")?.value || "Customer";
    const phone = document.getElementById("fphone")?.value || "";
    const service = document.getElementById("fservice")?.value || "General Enquiry";
    const location = document.getElementById("flocation")?.value || "";
    const message = document.getElementById("fmessage")?.value || "";

    const msg = encodeURIComponent(
        `Hello Moon Marine\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nLocation: ${location}\nMessage: ${message}\n\nPlease contact me regarding marine service.`
    );
    window.open(`https://wa.me/917708007222?text=${msg}`, "_blank");
}
// ===== GALLERY =====
function loadGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    const images = [
        "assets/images/engine-repair.jpeg",
        "assets/images/mercury-service.png",
        "assets/images/gps-installation.jpeg",
        "assets/images/fish-finder.jpeg",
        "assets/images/ais-setup.jpeg",
        "assets/images/spare-parts.png",
        "assets/images/emergency.png",
        "assets/images/installation.jpeg",
        "assets/images/electrical.jpeg",
        "assets/images/amc.jpg"
    ];

    grid.innerHTML = "";
    images.forEach((src, index) => {
        grid.innerHTML += `
            <div class="gallery-item">
                <img src="${src}" loading="lazy">
                <div class="gallery-overlay">
                    <span>Project ${index + 1}</span>
                </div>
            </div>
        `;
    });
}

// ===== BUBBLES ANIMATION =====
function createBubbles() {
    const container = document.getElementById("bubbles");
    if (!container) return;

    for (let i = 0; i < 14; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        const size = Math.random() * 14 + 4;
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = Math.random() * 100 + "%";
        bubble.style.bottom = Math.random() * 20 + "%";
        bubble.style.animationDuration = Math.random() * 10 + 6 + "s";

        container.appendChild(bubble);
    }
}

// =====================================================================JAVASCRIPT: Canvas rain + lightning + stars===================================================================== 


// ── Canvas Rain ──────────────────────────────────────────────────────────
const canvas = document.getElementById('rain-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  const section = document.getElementById('contact');
  canvas.width  = section.offsetWidth;
  canvas.height = section.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Rain drops pool
const drops = [];
const NUM_DROPS = 220;

function createDrop() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    len: Math.random() * 22 + 8,
    speed: Math.random() * 5 + 9,
    opacity: Math.random() * 0.35 + 0.1,
    width: Math.random() < 0.6 ? 1 : 1.5,
  };
}
for (let i = 0; i < NUM_DROPS; i++) {
  const d = createDrop();
  d.y = Math.random() * canvas.height; // stagger initial pos
  drops.push(d);
}

// Splash particles
const splashes = [];
function createSplash(x, y) {
  const count = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI;
    const speed = Math.random() * 2 + 0.5;
    splashes.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed - 1,
      life: 1,
      decay: Math.random() * 0.07 + 0.04,
      r: Math.random() * 2 + 1,
    });
  }
}

// Lightning
let lightningAlpha = 0;
let lightningTimer  = 0;
let nextLightning   = Math.random() * 5000 + 3000;
const flashEl = document.getElementById('lightningFlash');

function triggerLightning() {
  lightningAlpha = 0.45;
  if (flashEl) {
    flashEl.classList.add('flash');
    setTimeout(() => flashEl.classList.remove('flash'), 80);
    setTimeout(() => {
      if (flashEl) flashEl.classList.add('flash');
      setTimeout(() => flashEl && flashEl.classList.remove('flash'), 60);
    }, 160);
  }
  nextLightning = Math.random() * 6000 + 4000;
}

// Draw lightning bolt
function drawLightning() {
  if (lightningAlpha <= 0) return;
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  ctx.strokeStyle = `rgba(180,230,255,${lightningAlpha})`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = `rgba(180,230,255,${lightningAlpha})`;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  let cx = x, cy = 0;
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

// Moon
function drawMoon() {
  const mx = canvas.width * 0.78, my = canvas.height * 0.12;
  // glow
  const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 55);
  grd.addColorStop(0, 'rgba(230,240,255,0.12)');
  grd.addColorStop(1, 'rgba(230,240,255,0)');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(mx, my, 55, 0, Math.PI*2); ctx.fill();
  // moon disc
  ctx.fillStyle = 'rgba(220,235,255,0.55)';
  ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI*2); ctx.fill();
  // crescent shadow
  ctx.fillStyle = 'rgba(11,21,53,0.6)';
  ctx.beginPath(); ctx.arc(mx+7, my-3, 15, 0, Math.PI*2); ctx.fill();
  // moon reflection on water
  ctx.fillStyle = 'rgba(220,235,255,0.06)';
  const ry = canvas.height * 0.74;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(mx + (Math.random()-0.5)*20, ry + i*8, 20 - i*3, 3, 0, 0, Math.PI*2);
    ctx.fill();
  }
}

// animate
let lastTime = 0;
let lightningInterval = 0;

function animate(ts) {
  requestAnimationFrame(animate);
  const dt = Math.min(ts - lastTime, 40);
  lastTime = ts;
  lightningInterval += dt;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Moon
  drawMoon();

  // Rain
  ctx.lineCap = 'round';
  for (const d of drops) {
    ctx.strokeStyle = `rgba(180,220,255,${d.opacity})`;
    ctx.lineWidth = d.width;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - d.len * 0.22, d.y + d.len);
    ctx.stroke();
    d.x -= d.speed * 0.22;
    d.y += d.speed;
    if (d.y > canvas.height * 0.72) {
      createSplash(d.x, canvas.height * 0.72);
      Object.assign(d, createDrop());
    }
  }

  // Splashes
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    ctx.fillStyle = `rgba(180,220,255,${s.life * 0.5})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= s.decay;
    if (s.life <= 0) splashes.splice(i, 1);
  }

  // Lightning
  if (lightningInterval >= nextLightning) {
    triggerLightning();
    lightningInterval = 0;
  }
  drawLightning();
}
requestAnimationFrame(animate);

// ── CSS Rain drops (extra) ───────────────────────────────────────────────
const rl = document.getElementById('rainLayer');
for (let i = 0; i < 60; i++) {
  const d = document.createElement('div');
  d.className = 'rain-drop';
  const h = Math.random() * 25 + 12;
  d.style.cssText = `
    left:${Math.random()*100}%;
    height:${h}px;
    animation-duration:${Math.random()*0.6+0.6}s;
    animation-delay:${Math.random()*2}s;
    opacity:${Math.random()*0.4+0.1};
  `;
  rl.appendChild(d);
}

// ── Water ripples ────────────────────────────────────────────────────────
const rc = document.getElementById('rippleContainer');
function makeRipple() {
  const section = document.getElementById('contact');
  const r = document.createElement('div');
  r.className = 'ripple';
  const size = Math.random() * 60 + 20;
  r.style.cssText = `
    left:${Math.random()*90+5}%;
    width:${size}px; height:${size * 0.35}px;
    animation-duration:${Math.random()*2+1.5}s;
    animation-delay:0s;
    z-index:2; pointer-events:none;
  `;
  section.appendChild(r);
  setTimeout(() => r.remove(), 4000);
}
setInterval(makeRipple, 400);

// ── Stars ─────────────────────────────────────────────────────────────────
const sc = document.getElementById('starsContainer');
for (let i = 0; i < 55; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2 + 0.8;
  s.style.cssText = `
    width:${sz}px; height:${sz}px;
    top:${Math.random()*55}%;
    left:${Math.random()*100}%;
    animation-duration:${Math.random()*3+2}s;
    animation-delay:${Math.random()*4}s;
  `;
  sc.appendChild(s);
}

// ── Footer stars ─────────────────────────────────────────────────────────
const fs = document.getElementById('footerStars');
for (let i = 0; i < 30; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2 + 0.5;
  s.style.cssText = `
    width:${sz}px; height:${sz}px;
    top:${Math.random()*100}%;
    left:${Math.random()*100}%;
    animation-duration:${Math.random()*4+2}s;
    animation-delay:${Math.random()*5}s;
  `;
  fs.appendChild(s);
}

