
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


