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

function sendToWhatsApp(service){
    window.open(
        "https://wa.me/+917708007222?text=" +
        encodeURIComponent("Hello Moon Marine, I'm interested in " + service),
        "_blank"
    );
}

function razorpayDemo(){
    alert('✅ Razorpay demo: ₹500 payment successful.');
}
