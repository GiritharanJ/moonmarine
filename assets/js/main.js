// ===== MOBILE MENU FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenu = document.getElementById("close-menu");
    const overlay = document.getElementById("mobile-overlay");

    if (menuBtn && mobileMenu && closeMenu && overlay) {
        menuBtn.onclick = function() {
            mobileMenu.classList.add("open");
            overlay.classList.add("open");
            document.body.style.overflow = 'hidden';
        };

        closeMenu.onclick = function() {
            mobileMenu.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = '';
        };

        overlay.onclick = function() {
            mobileMenu.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = '';
        };
    }

    // ===== SLIDESHOW FUNCTIONALITY =====
    const slides = document.querySelectorAll(".slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(function() {
            slides[currentSlide]?.classList.remove("opacity-100");
            slides[currentSlide]?.classList.add("opacity-0");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide]?.classList.remove("opacity-0");
            slides[currentSlide]?.classList.add("opacity-100");
        }, 2000);
    }
});

// ===== SERVICE REQUEST MODAL FUNCTIONS =====
function openRequestForm(serviceName) {
    const modal = document.getElementById('requestModal');
    const serviceInput = document.getElementById('selectedService');
    const modalTitle = document.getElementById('modalServiceTitle');
    
    if (serviceInput) serviceInput.value = serviceName;
    if (modalTitle) modalTitle.innerText = serviceName + ' - Request';
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeRequestForm() {
    const modal = document.getElementById('requestModal');
    const form = document.getElementById('serviceRequestForm');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
    if (form) form.reset();
}

// ===== RAZORPAY PAYMENT FUNCTION =====
function processRazorpayPayment() {
    const name = document.getElementById('customerName')?.value;
    const mobile = document.getElementById('customerMobile')?.value;
    const service = document.getElementById('selectedService')?.value;

    if (!name || !mobile || mobile.length !== 10) {
        alert('Please enter valid name and 10-digit mobile number');
        return false;
    }

    // Razorpay options
    const options = {
        key: "rzp_test_SOFGkNAl65XbTx", // 🔴 REPLACE WITH YOUR ACTUAL RAZORPAY LIVE KEY
        amount: "500", // Amount in paise (50000 = ₹500)
        currency: "INR",
        name: "Moon Marine Services",
        description: `Advance for ${service}`,
        image: "assets/images/logo.jpeg",
        handler: function(response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}\nThank you for booking with Moon Marine.`);
            
            // Send WhatsApp confirmation (optional)
            const message = `Hello ${name}, your ${service} booking is confirmed with payment ID: ${response.razorpay_payment_id}. Thank you for choosing Moon Marine!`;
            window.open(`https://wa.me/+917708007222?text=${encodeURIComponent(message)}`, '_blank');
            
            closeRequestForm();
        },
        prefill: {
            name: name,
            contact: mobile
        },
        theme: {
            color: "#0c0a36"
        },
        modal: {
            ondismiss: function() {
                console.log("Payment cancelled");
            }
        }
    };

    try {
        const rzp = new Razorpay(options);
        rzp.open();
        return false; // Prevent form submission
    } catch (error) {
        console.error("Razorpay Error:", error);
        alert("Payment gateway error. Please try again or contact support.");
        return false;
    }
}

// ===== ATTACH PAYMENT HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.getElementById('payNowBtn');
    if (payBtn) {
        payBtn.onclick = function(e) {
            e.preventDefault();
            processRazorpayPayment();
        };
    }

    // Form submit prevention
    const serviceForm = document.getElementById('serviceRequestForm');
    if (serviceForm) {
        serviceForm.onsubmit = function(e) {
            e.preventDefault();
            processRazorpayPayment();
            return false;
        };
    }
});

// ===== WHATSAPP FUNCTIONS =====
function sendToWhatsApp(service) {
    window.open(
        "https://wa.me/+917708007222?text=" +
        encodeURIComponent("Hello Moon Marine, I'm interested in " + service),
        "_blank"
    );
}

function sendEngineLead(model) {
    const message = `Hello Moon Marine, I'm interested to purchase the ${model}. Please share price and free quotation.`;
    window.open(
        "https://wa.me/+917708007222?text=" + encodeURIComponent(message),
        "_blank"
    );
}

// ===== TOGGLE MOBILE SERVICES (if needed) =====
function toggleMobileServices() {
    const el = document.getElementById("mobile-services");
    if (el) el.classList.toggle("hidden");
}



// WhatsApp function for general inquiries
    function sendToWhatsApp(message) {
        const phoneNumber = "+917708007222";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Specific function for engine leads (with predefined message format)
    function sendEngineLead(model) {
        const message = `Hello Moon Marine, I'm interested to purchase the ${model}. Please share price and free quotation.`;
        const phoneNumber = "+917708007222";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // ===== MOBILE MENU FUNCTIONALITY - FIXED =====
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenu = document.getElementById("close-menu");
    const overlay = document.getElementById("mobile-overlay");

    if (menuBtn && mobileMenu && closeMenu && overlay) {
        menuBtn.onclick = () => {
            mobileMenu.classList.add("open");
            overlay.classList.add("open");
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        closeMenu.onclick = () => {
            mobileMenu.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = ''; // Restore scrolling
        };

        overlay.onclick = () => {
            mobileMenu.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = '';
        };
    }

    // ===== FORM BUTTON TOGGLE (Send Request / Pay ₹500) - FIXED =====
 
    document.addEventListener("DOMContentLoaded", function(){

const requestType = document.getElementById("requestType");
const sendBtn = document.getElementById("sendBtn");
const payBtn = document.getElementById("payBtn");
const serviceForm = document.getElementById("serviceForm");
const thankMessage = document.getElementById("thankMessage");


// Toggle buttons
if(requestType){

requestType.addEventListener("change", function(){

if(this.value === "service"){

sendBtn.classList.add("hidden");
payBtn.classList.remove("hidden");

}else{

payBtn.classList.add("hidden");
sendBtn.classList.remove("hidden");

}

});

}


// Razorpay redirect
if(payBtn){

payBtn.onclick = function(){

window.location.href="https://razorpay.me/@giritharanjanakiraman";

};

}


// Show thank message AFTER submit
if(serviceForm){

serviceForm.addEventListener("submit", function(){

if(thankMessage){

thankMessage.classList.remove("hidden");

}

});

}


// Fix for formsubmit redirect
const nextInput = document.querySelector('input[name="_next"]');

if(nextInput){

nextInput.value = window.location.href;

}

});
    // ===== OTHER FUNCTIONS (kept from original) =====
    function toggleMobileServices() {
        document.getElementById("mobile-services").classList.toggle("hidden");
    }

    // Slideshow functionality
    let slides = document.querySelectorAll(".slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove("opacity-100");
            slides[currentSlide].classList.add("opacity-0");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.remove("opacity-0");
            slides[currentSlide].classList.add("opacity-100");
        }, 2000);
    }

    function sendToWhatsApp(service) {
        window.open(
            "https://wa.me/+917708007222?text=" +
            encodeURIComponent("Hello Moon Marine, I'm interested in " + service),
            "_blank"
        );
    }
    
    function sendEngineLead(model) {
        const message = `Hello Moon Marine, I'm interested to purchase the ${model}. Please share price and free quotation.`;
        window.open(
            "https://wa.me/+917708007222?text=" + encodeURIComponent(message),
            "_blank"
        );
    }


