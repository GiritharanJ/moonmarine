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
