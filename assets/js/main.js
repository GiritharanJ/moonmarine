const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("mobile-overlay");

menuBtn.onclick = () => {
    mobileMenu.classList.add("open");
    overlay.classList.add("open");
};

closeMenu.onclick = () => {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("open");
};

overlay.onclick = () => {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("open");
};

function toggleMobileServices() {
    document.getElementById("mobile-services").classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });

});

let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

setInterval(() => {
    slides[currentSlide].classList.remove("opacity-100");
    slides[currentSlide].classList.add("opacity-0");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.remove("opacity-0");
    slides[currentSlide].classList.add("opacity-100");
}, 2000);

function sendToWhatsApp(service){
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
const requestType = document.getElementById("requestType");
const sendBtn = document.getElementById("sendBtn");
const payBtn = document.getElementById("payBtn");

requestType.addEventListener("change", function(){

let value = this.value;

if(value === "service" || value === "gps_install"){

sendBtn.classList.add("hidden");
payBtn.classList.remove("hidden");

}
else{

payBtn.classList.add("hidden");
sendBtn.classList.remove("hidden");

}

});
<script>

document.getElementById("payBtn").onclick = function(){

window.location.href = "https://razorpay.me/@giritharanjanakiraman";

};

</script>
