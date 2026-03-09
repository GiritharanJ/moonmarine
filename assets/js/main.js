/* =============================================================
   MOON MARINE — main.js  (COMPLETE FINAL)
   Business Flow:
     1. Customer clicks service card → openRequestForm(serviceName)
     2. Modal opens, service pre-filled
     3. Customer types Name + Phone → clicks "Pay ₹500 Advance"
     4. Razorpay opens → customer pays
     5. On success → showReceipt() + sendBookingEmail() via contact.php
     6. Owner receives rich HTML email with booking + payment details
   ============================================================= */

/* ── CONFIG ─────────────────────────────────────────────────── */
var RAZORPAY_KEY   = 'rzp_live_SOFjRPAj8NXqRQ'; // ← Replace with rzp_test_XXXX for testing
var BOOKING_AMOUNT = 1000;                        // paise: 1000 = ₹10 advance
var WA_NUMBER      = '917708007222';
var CONTACT_PHP    = 'contact.php';

/* =========================================================
   1. DOM READY — init all page features
========================================================= */
document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('galleryGrid'))    { loadGallery(); }
    if (document.getElementById('bubbles'))        { createBubbles(); }
    if (document.getElementById('rain-canvas'))    { initRainCanvas(); }
    if (document.getElementById('footerStars'))    { createFooterStars(); }
    if (document.getElementById('starsContainer')) { createContactStars(); }
    if (document.getElementById('rainLayer'))      { createRainDrops(); }
    if (document.getElementById('contact'))        { startRipples(); }

    /* Wire up Pay Now button inside services modal */
    var payBtn = document.getElementById('payNowBtn');
    if (payBtn) {
        payBtn.addEventListener('click', function () {
            initiatePayment();
        });
    }

    /* Close modal when clicking backdrop */
    var modal = document.getElementById('requestModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeRequestForm();
        });
    }

});

/* =========================================================
   2. SERVICE REQUEST MODAL
   Called by onclick="openRequestForm('Engine Repair')"
   on each service card in services.html
========================================================= */
function openRequestForm(serviceName) {
    var modal     = document.getElementById('requestModal');
    var titleEl   = document.getElementById('modalServiceTitle');
    var serviceEl = document.getElementById('selectedService');

    if (!modal) return;

    if (titleEl)   titleEl.textContent = 'Book: ' + serviceName;
    if (serviceEl) serviceEl.value     = serviceName;

    /* Clear previous inputs */
    var nameEl  = document.getElementById('customerName');
    var phoneEl = document.getElementById('customerMobile');
    if (nameEl)  nameEl.value  = '';
    if (phoneEl) phoneEl.value = '';

    /* Hide any old error */
    var errEl = document.getElementById('modalError');
    if (errEl) errEl.style.display = 'none';

    /* Show modal */
    modal.style.display = 'flex';
    modal.classList.remove('hidden');

    setTimeout(function () { if (nameEl) nameEl.focus(); }, 120);
}

function closeRequestForm() {
    var modal = document.getElementById('requestModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.add('hidden');
}

/* =========================================================
   3. PAYMENT FLOW — triggered by #payNowBtn
========================================================= */
function initiatePayment() {
    var nameEl    = document.getElementById('customerName');
    var phoneEl   = document.getElementById('customerMobile');
    var serviceEl = document.getElementById('selectedService');

    var name    = nameEl    ? nameEl.value.trim()                    : '';
    var phone   = phoneEl   ? phoneEl.value.trim().replace(/\D/g,'') : '';
    var service = serviceEl ? serviceEl.value                        : 'Marine Service';

    if (!name) {
        showModalError('Please enter your full name.');
        if (nameEl) nameEl.focus();
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        showModalError('Please enter a valid 10-digit mobile number.');
        if (phoneEl) phoneEl.focus();
        return;
    }

    if (typeof Razorpay === 'undefined') {
        showModalError('Payment system not loaded. Please refresh the page and try again.');
        return;
    }

    var bookingData = {
        name:     name,
        phone:    phone,
        service:  service,
        location: 'Will be confirmed',
        message:  'Advance booking via website — Service: ' + service
    };

    var options = {
        key:         RAZORPAY_KEY,
        amount:      BOOKING_AMOUNT,
        currency:    'INR',
        name:        'Moon Marine Services',
        description: 'Advance Booking: ' + service,
        image:       'assets/images/logo.jpeg',
        prefill: {
            name:    name,
            contact: '91' + phone
        },
        notes: {
            service:  service,
            customer: name
        },
        theme: { color: '#4dd9d0' },

        handler: function (response) {
            var payId = response.razorpay_payment_id;
            closeRequestForm();
            showReceipt(bookingData, payId);
            sendBookingEmail(bookingData, payId);
        },

        modal: {
            ondismiss: function () {
                showModalError('Payment cancelled. Use WhatsApp to book without payment.');
            }
        }
    };

    try {
        var rzp = new Razorpay(options);
        rzp.on('payment.failed', function (resp) {
            showModalError('Payment failed: ' + resp.error.description);
        });
        rzp.open();
    } catch (e) {
        showModalError('Could not open payment window. Please try WhatsApp booking.');
        console.error('Razorpay error:', e);
    }
}

function showModalError(msg) {
    var el = document.getElementById('modalError');
    if (!el) el = document.getElementById('formError');
    if (el) {
        el.textContent   = msg;
        el.style.display = 'block';
        setTimeout(function () { el.style.display = 'none'; }, 4000);
    } else {
        alert(msg);
    }
}

/* =========================================================
   4. RECEIPT MODAL
========================================================= */
function showReceipt(data, paymentId) {
    var modal = document.getElementById('paymentReceipt');
    if (!modal) return;

    var now     = new Date();
    var dateStr = now.toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  }) + ' ' +
                  now.toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  });
    var amountStr = '₹' + (BOOKING_AMOUNT / 100).toFixed(0);

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    setText('r_payId',    paymentId);
    setText('r_name',     data.name);
    setText('r_phone',    '+91 ' + data.phone);
    setText('r_service',  data.service);
    setText('r_location', data.location || 'Not specified');
    setText('r_amount',   amountStr);
    setText('r_date',     dateStr);

    modal.classList.add('show');
}

function closeReceipt() {
    var modal = document.getElementById('paymentReceipt');
    if (modal) modal.classList.remove('show');
}

/* =========================================================
   5. SEND EMAIL via contact.php (PHPMailer)
========================================================= */
function sendBookingEmail(data, paymentId) {
    var body = new FormData();
    body.append('name',       data.name);
    body.append('phone',      data.phone);
    body.append('service',    data.service);
    body.append('location',   data.location   || 'Not specified');
    body.append('message',    data.message    || 'Advance booking via website');
    body.append('payment_id', paymentId       || 'N/A');
    body.append('amount',     '₹' + (BOOKING_AMOUNT / 100));

    fetch(CONTACT_PHP, { method: 'POST', body: body })
        .then(function (r) { return r.json(); })
        .then(function (d) {
            if (d.status === 'success') {
                console.log('Booking email sent to owner');
            } else {
                console.warn('Email warning:', d.message);
            }
        })
        .catch(function (e) {
            console.warn('Email (needs PHP server — expected on GitHub Pages):', e.message);
        });
}

/* =========================================================
   6. CONTACT SECTION FORM (index.html)
========================================================= */
function submitForm() {
    var data = validateContactForm();
    if (!data) return;

    if (typeof Razorpay === 'undefined') {
        showFormError('Payment system not loaded. Please refresh and try again.');
        return;
    }

    var options = {
        key:         RAZORPAY_KEY,
        amount:      BOOKING_AMOUNT,
        currency:    'INR',
        name:        'Moon Marine Services',
        description: 'Advance Booking: ' + data.service,
        image:       'assets/images/logo.jpeg',
        prefill: {
            name:    data.name,
            contact: '91' + data.phone
        },
        notes: {
            service:  data.service,
            location: data.location
        },
        theme: { color: '#4dd9d0' },
        handler: function (response) {
            showReceipt(data, response.razorpay_payment_id);
            sendBookingEmail(data, response.razorpay_payment_id);
            resetContactForm();
        },
        modal: {
            ondismiss: function () {
                if (confirm('Payment cancelled. Book via WhatsApp instead?')) {
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
        showFormError('Unable to open payment. Please use WhatsApp booking.');
        console.error('Razorpay error:', e);
    }
}

function validateContactForm() {
    var nameEl    = document.getElementById('fname');
    var phoneEl   = document.getElementById('fphone');
    var serviceEl = document.getElementById('fservice');

    var name    = nameEl    ? nameEl.value.trim()                     : '';
    var phone   = phoneEl   ? phoneEl.value.trim().replace(/\D/g, '') : '';
    var service = serviceEl ? serviceEl.value                         : '';

    if (!name)  { showFormError('Please enter your full name.'); return null; }
    if (!/^\d{10}$/.test(phone)) { showFormError('Please enter a valid 10-digit mobile number.'); return null; }

    var locationEl = document.getElementById('flocation');
    var messageEl  = document.getElementById('fmessage');

    return {
        name:     name,
        phone:    phone,
        service:  service   || 'Not specified',
        location: locationEl ? (locationEl.value  || 'Not specified') : 'Not specified',
        message:  messageEl  ? (messageEl.value.trim() || 'No message') : 'No message'
    };
}

function showFormError(msg) {
    var el = document.getElementById('formError');
    if (el) {
        el.textContent   = msg;
        el.style.display = 'block';
        setTimeout(function () { el.style.display = 'none'; }, 4000);
    } else {
        alert(msg);
    }
}

function resetContactForm() {
    ['fname', 'fphone', 'fservice', 'flocation', 'fmessage'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
    });
}

/* =========================================================
   7. WHATSAPP HELPERS
========================================================= */
function sendToWhatsApp(service) {
    var msg = encodeURIComponent('Hello Moon Marine,\n\nI am interested in: ' + service + '\n\nPlease contact me.');
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

function sendEngineLead(product) {
    var msg = encodeURIComponent('Hello Moon Marine,\n\nI am interested in: ' + product + '\n\nPlease send details and quotation.');
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

function submitWhatsApp() {
    var nameEl     = document.getElementById('fname');
    var phoneEl    = document.getElementById('fphone');
    var serviceEl  = document.getElementById('fservice');
    var locationEl = document.getElementById('flocation');
    var messageEl  = document.getElementById('fmessage');

    var name     = nameEl     ? nameEl.value.trim()    : 'Customer';
    var phone    = phoneEl    ? phoneEl.value.trim()   : '';
    var service  = serviceEl  ? serviceEl.value        : 'General Enquiry';
    var location = locationEl ? locationEl.value       : '';
    var message  = messageEl  ? messageEl.value.trim() : '';

    if (!name) name = 'Customer';

    var msg = encodeURIComponent(
        'Hello Moon Marine\n\n' +
        'Name: '     + name     + '\n' +
        'Phone: '    + phone    + '\n' +
        'Service: '  + service  + '\n' +
        'Location: ' + location + '\n' +
        'Message: '  + message  + '\n\n' +
        'Please contact me regarding marine service.'
    );
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

/* =========================================================
   8. GALLERY
========================================================= */
function loadGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    var images = [
        { src: 'assets/images/engine-repair.jpeg',    label: 'Engine Repair Job' },
        { src: 'assets/images/mercury-service.png',   label: 'Mercury Service'   },
        { src: 'assets/images/gps-installation.jpeg', label: 'GPS Installation'  },
        { src: 'assets/images/fish-finder.jpeg',      label: 'Fish Finder Setup' },
        { src: 'assets/images/ais-setup.jpeg',        label: 'AIS System'        },
        { src: 'assets/images/spare-parts.png',       label: 'Spare Parts'       },
        { src: 'assets/images/emergency.png',         label: 'Emergency Job'     },
        { src: 'assets/images/installation.jpeg',     label: 'Engine Install'    },
        { src: 'assets/images/electrical.jpeg',       label: 'Electrical Work'   },
        { src: 'assets/images/amc.jpg',               label: 'AMC Service'       }
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
   9. BUBBLES
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
            'width:'              + size                       + 'px;' +
            'height:'             + size                       + 'px;' +
            'left:'               + (Math.random() * 100)     + '%;'  +
            'bottom:'             + (Math.random() * 20)      + '%;'  +
            'position:fixed;'                                          +
            'animation-duration:' + (Math.random() * 10 + 6)  + 's;' +
            'animation-delay:'    + (Math.random() * 5)       + 's;'  +
            'z-index:-1;';
        container.appendChild(b);
    }
}

/* =========================================================
   10. RAIN CANVAS
========================================================= */
function initRainCanvas() {
    var canvas  = document.getElementById('rain-canvas');
    if (!canvas) return;
    var ctx     = canvas.getContext('2d');
    var section = document.getElementById('contact');
    function resizeCanvas() {
        if (!section) return;
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    var drops = [], splashes = [], NUM_DROPS = 200;
    function createDrop() {
        return { x: Math.random()*canvas.width, y: Math.random()*-canvas.height,
                 len: Math.random()*22+8, speed: Math.random()*5+9,
                 opacity: Math.random()*0.35+0.1, width: Math.random()<0.6?1:1.5 };
    }
    for (var i=0;i<NUM_DROPS;i++) { var d=createDrop(); d.y=Math.random()*canvas.height; drops.push(d); }
    function createSplash(x,y) {
        for (var j=0;j<Math.floor(Math.random()*4)+2;j++) {
            var angle=Math.random()*Math.PI, speed=Math.random()*2+0.5;
            splashes.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:-Math.sin(angle)*speed-1,
                           life:1,decay:Math.random()*0.07+0.04,r:Math.random()*2+1});
        }
    }
    var lightningAlpha=0, lightningInterval=0, nextLightning=Math.random()*5000+3000;
    var flashEl=document.getElementById('lightningFlash');
    function triggerLightning() {
        lightningAlpha=0.45;
        if (flashEl) {
            flashEl.classList.add('flash');
            setTimeout(function(){flashEl.classList.remove('flash');},80);
            setTimeout(function(){if(flashEl){flashEl.classList.add('flash');setTimeout(function(){flashEl.classList.remove('flash');},60);}},160);
        }
        nextLightning=Math.random()*6000+4000;
    }
    function drawLightning() {
        if(lightningAlpha<=0)return;
        var lx=Math.random()*canvas.width*0.8+canvas.width*0.1;
        ctx.strokeStyle='rgba(180,230,255,'+lightningAlpha+')';ctx.lineWidth=1.5;
        ctx.shadowColor='rgba(180,230,255,'+lightningAlpha+')';ctx.shadowBlur=8;
        ctx.beginPath();var cx=lx,cy=0;ctx.moveTo(cx,cy);
        while(cy<canvas.height*0.55){cx+=(Math.random()-0.5)*30;cy+=Math.random()*20+10;ctx.lineTo(cx,cy);}
        ctx.stroke();ctx.shadowBlur=0;lightningAlpha-=0.05;
    }
    function drawMoon() {
        var mx=canvas.width*0.78,my=canvas.height*0.12;
        var grd=ctx.createRadialGradient(mx,my,0,mx,my,55);
        grd.addColorStop(0,'rgba(230,240,255,0.12)');grd.addColorStop(1,'rgba(230,240,255,0)');
        ctx.fillStyle=grd;ctx.beginPath();ctx.arc(mx,my,55,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(220,235,255,0.55)';ctx.beginPath();ctx.arc(mx,my,18,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(11,21,53,0.6)';ctx.beginPath();ctx.arc(mx+7,my-3,15,0,Math.PI*2);ctx.fill();
    }
    var lastTime=0;
    function animate(ts) {
        requestAnimationFrame(animate);
        var dt=Math.min(ts-lastTime,40);lastTime=ts;lightningInterval+=dt;
        ctx.clearRect(0,0,canvas.width,canvas.height);drawMoon();ctx.lineCap='round';
        drops.forEach(function(dr){
            ctx.strokeStyle='rgba(180,220,255,'+dr.opacity+')';ctx.lineWidth=dr.width;
            ctx.beginPath();ctx.moveTo(dr.x,dr.y);ctx.lineTo(dr.x-dr.len*0.22,dr.y+dr.len);ctx.stroke();
            dr.x-=dr.speed*0.22;dr.y+=dr.speed;
            if(dr.y>canvas.height*0.72){createSplash(dr.x,canvas.height*0.72);Object.assign(dr,createDrop());}
        });
        for(var si=splashes.length-1;si>=0;si--){
            var s=splashes[si];ctx.fillStyle='rgba(180,220,255,'+(s.life*0.5)+')';
            ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
            s.x+=s.vx;s.y+=s.vy;s.vy+=0.12;s.life-=s.decay;if(s.life<=0)splashes.splice(si,1);
        }
        if(lightningInterval>=nextLightning){triggerLightning();lightningInterval=0;}
        drawLightning();
    }
    requestAnimationFrame(animate);
}

function createRainDrops() {
    var rl=document.getElementById('rainLayer');if(!rl)return;rl.innerHTML='';
    for(var i=0;i<60;i++){
        var d=document.createElement('div');d.className='rain-drop';var h=Math.random()*25+12;
        d.style.cssText='left:'+(Math.random()*100)+'%;height:'+h+'px;animation-duration:'+(Math.random()*0.6+0.6)+'s;animation-delay:'+(Math.random()*2)+'s;opacity:'+(Math.random()*0.4+0.1)+';';
        rl.appendChild(d);
    }
}

function startRipples() {
    var section=document.getElementById('contact');if(!section)return;
    setInterval(function(){
        var r=document.createElement('div');r.className='ripple';var size=Math.random()*60+20;
        r.style.cssText='left:'+(Math.random()*90+5)+'%;width:'+size+'px;height:'+(size*0.35)+'px;animation-duration:'+(Math.random()*2+1.5)+'s;z-index:2;pointer-events:none;';
        section.appendChild(r);setTimeout(function(){r.remove();},4000);
    },400);
}

function createContactStars() {
    var sc=document.getElementById('starsContainer');if(!sc)return;sc.innerHTML='';
    for(var i=0;i<55;i++){
        var s=document.createElement('div');s.className='star';var sz=Math.random()*2+0.8;
        s.style.cssText='width:'+sz+'px;height:'+sz+'px;top:'+(Math.random()*55)+'%;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*3+2)+'s;animation-delay:'+(Math.random()*4)+'s;';
        sc.appendChild(s);
    }
}

function createFooterStars() {
    var fs=document.getElementById('footerStars');if(!fs)return;fs.innerHTML='';
    for(var i=0;i<30;i++){
        var s=document.createElement('div');s.className='star';var sz=Math.random()*2+0.5;
        s.style.cssText='width:'+sz+'px;height:'+sz+'px;top:'+(Math.random()*100)+'%;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*4+2)+'s;animation-delay:'+(Math.random()*5)+'s;';
        fs.appendChild(s);
    }
}
