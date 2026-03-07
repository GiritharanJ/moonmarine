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
});

// ===== SERVICE REQUEST MODAL FUNCTIONS =====
function openRequestForm(serviceName) {
    const modal = document.getElementById('requestModal');
    const serviceInput = document.getElementById('selectedService');
    const modalTitle = document.getElementById('modalServiceTitle');
    const emailSubject = document.getElementById('emailSubject');
    
    if (serviceInput) serviceInput.value = serviceName;
    if (modalTitle) modalTitle.innerText = serviceName + ' - Request';
    if (emailSubject) emailSubject.value = `New Booking: ${serviceName} - ₹500 Advance Payment`;
    
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
        alert('Please fill all fields with valid information');
        return false;
    }

    // Razorpay options
    const options = {
        key: "rzp_live_SOFjRPAj8NXqRQ", // 🔴 Replace with your Razorpay live key
        amount: "50000", // ₹500 in paise
        currency: "INR",
        name: "Moon Marine Services",
        description: `Advance for ${service}`,
        image: "assets/images/logo.jpeg",
        handler: function(response) {
            // Update payment status and ID in form
            document.getElementById('paymentStatus').value = 'success';
            document.getElementById('paymentId').value = response.razorpay_payment_id;
            
            // Submit the form to FormSubmit
            submitFormToFormSubmit({
                name: name,
                mobile: mobile,
                service: service,
                paymentId: response.razorpay_payment_id,
                amount: "500",
                status: "Success",
                date: new Date().toLocaleString('en-IN')
            });
            
            // Show success message
            alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nBooking details sent to your email.`);
            
            // WhatsApp confirmation to customer
            const message = `Hello ${name}, your ${service} booking is confirmed! ✅\nPayment ID: ${response.razorpay_payment_id}\nAmount: ₹500\nThank you for choosing Moon Marine.`;
            window.open(`https://wa.me/+917708007222?text=${encodeURIComponent(message)}`, '_blank');
            
            closeRequestForm();
        },
        prefill: {
            name: name,
            email: email,
            contact: mobile
        },
        theme: { color: "#0c0a36" }
    };

    try {
        const rzp = new Razorpay(options);
        rzp.open();
        return false;
    } catch (error) {
        console.error("Razorpay Error:", error);
        alert("Payment gateway error. Please try again.");
        return false;
    }
}

// ===== SUBMIT FORM TO FORMSUBMIT =====
function submitFormToFormSubmit(details) {
    const form = document.getElementById('serviceRequestForm');
    
    // Create FormData object
    const formData = new FormData();
    formData.append('name', details.name);
    formData.append('email', details.email);
    formData.append('phone', details.mobile);
    formData.append('service', details.service);
    formData.append('payment_id', details.paymentId);
    formData.append('amount', details.amount);
    formData.append('status', details.status);
    formData.append('date', details.date);
    formData.append('_subject', `💰 Payment Received: ₹${details.amount} for ${details.service}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    // Send to FormSubmit
    fetch('https://formsubmit.co/ajax/moonmarinenavicationcomunicati@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('FormSubmit success:', data);
    })
    .catch(error => {
        console.error('FormSubmit error:', error);
        // Fallback: traditional form submission
        form.submit();
    });
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
    const message = `Hello Moon Marine, I'm interested in ${model}. Please share price and quotation.`;
    window.open(
        "https://wa.me/+917708007222?text=" + encodeURIComponent(message),
        "_blank"
    );
}
