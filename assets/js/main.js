<script>
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
    document.addEventListener("DOMContentLoaded", function() {
        const requestType = document.getElementById("requestType");
        const sendBtn = document.getElementById("sendBtn");
        const payBtn = document.getElementById("payBtn");
        const serviceForm = document.getElementById("serviceForm");
        const thankMessage = document.getElementById("thankMessage");

        // Toggle between send and pay buttons based on selection
        if (requestType && sendBtn && payBtn) {
            requestType.addEventListener("change", function() {
                if (this.value === "service") {
                    sendBtn.classList.add("hidden");
                    payBtn.classList.remove("hidden");
                } else {
                    payBtn.classList.add("hidden");
                    sendBtn.classList.remove("hidden");
                }
            });
        }

        // Payment button click - redirect to Razorpay
        if (payBtn) {
            payBtn.onclick = function() {
                window.location.href = "https://razorpay.me/@giritharanjanakiraman";
            };
        }

        // Form submission handling - show thank you message without reloading
        if (serviceForm) {
            serviceForm.addEventListener("submit", function(e) {
                e.preventDefault(); // Prevent actual form submission for demo
                
                // Hide the form (optional)
                // serviceForm.style.display = 'none';
                
                // Show thank you message
                if (thankMessage) {
                    thankMessage.classList.remove("hidden");
                }
                
                // You can still submit the form via AJAX if needed
                // For now, we'll just show the message
                console.log("Form submitted - thank you message shown");
                
                // If you want to actually submit to formsubmit.co, uncomment below:
                // this.submit();
            });
        }

        // Fix for formsubmit.co - set _next to current page to avoid redirect
        const nextInput = document.querySelector('input[name="_next"]');
        if (nextInput) {
            nextInput.value = window.location.href; // Stay on same page
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
</script>
