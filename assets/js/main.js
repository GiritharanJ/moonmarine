// ===== MOON MARINE MAIN JS =====

// ===== MOBILE MENU =====
document.addEventListener("DOMContentLoaded", function () {

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("mobile-overlay");

if(menuBtn && mobileMenu && closeMenu && overlay){

menuBtn.onclick = function(){
mobileMenu.classList.add("open");
overlay.classList.add("open");
document.body.style.overflow="hidden";
};

closeMenu.onclick = function(){
mobileMenu.classList.remove("open");
overlay.classList.remove("open");
document.body.style.overflow="";
};

overlay.onclick = function(){
mobileMenu.classList.remove("open");
overlay.classList.remove("open");
document.body.style.overflow="";
};

}

// close menu when clicking menu links
const menuLinks = document.querySelectorAll("#mobile-menu a");

menuLinks.forEach(link=>{
link.addEventListener("click",function(){

mobileMenu.classList.remove("open");
overlay.classList.remove("open");
document.body.style.overflow="";

});
});

});

// initialize gallery and bubbles
loadGallery();
createBubbles();

});


// ===== WHATSAPP FUNCTIONS =====

function sendToWhatsApp(service){

const msg = encodeURIComponent(
`Hello Moon Marine,

I am interested in: ${service}

Please contact me.`
);

window.open(`https://wa.me/917708007222?text=${msg}`,"_blank");

}

function sendEngineLead(product){

const msg = encodeURIComponent(
`Hello Moon Marine,

I am interested in: ${product}

Please send details and quotation.`
);

window.open(`https://wa.me/917708007222?text=${msg}`,"_blank");

}


// ===== CONTACT FORM =====

function submitForm(){

const name = document.getElementById("fname")?.value;
const phone = document.getElementById("fphone")?.value;

if(!name || !phone){
alert("Please enter name and phone number");
return;
}

const formData = new FormData();
formData.append("name",name);
formData.append("phone",phone);
formData.append("_captcha","false");

fetch("https://formsubmit.co/ajax/moonmarinenavicationcomunicati@gmail.com",{
method:"POST",
body:formData
})
.then(()=>{

alert("Thank you! We will contact you shortly.");

document.getElementById("fname").value="";
document.getElementById("fphone").value="";

})
.catch(()=>{
alert("Form submitted successfully.");
});

}


// ===== WHATSAPP FORM =====

function submitWhatsApp(){

const name = document.getElementById("fname")?.value || "Customer";
const phone = document.getElementById("fphone")?.value || "";

const msg = encodeURIComponent(
`Hello Moon Marine

Name: ${name}
Phone: ${phone}

Please contact me regarding marine service.`
);

window.open(`https://wa.me/917708007222?text=${msg}`,"_blank");

}


// ===== GALLERY =====

function loadGallery(){

const grid = document.getElementById("galleryGrid");
if(!grid) return;

const images=[

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

grid.innerHTML="";

images.forEach((src,index)=>{

grid.innerHTML+=`
<div class="gallery-item">

<img src="${src}" loading="lazy">

<div class="gallery-overlay">

<span>Project ${index+1}</span>

</div>

</div>
`;

});

}


// ===== BUBBLES ANIMATION =====

function createBubbles(){

const container=document.getElementById("bubbles");
if(!container) return;

for(let i=0;i<14;i++){

const bubble=document.createElement("div");
bubble.className="bubble";

const size=Math.random()*14+4;

bubble.style.width=size+"px";
bubble.style.height=size+"px";
bubble.style.left=Math.random()*100+"%";
bubble.style.bottom=Math.random()*20+"%";
bubble.style.animationDuration=(Math.random()*10+6)+"s";

container.appendChild(bubble);

}

}


// ===== RAZORPAY PAYMENT =====

function submitForm(){

const name = document.getElementById('fname').value;
const phone = document.getElementById('fphone').value;
const service = document.getElementById('fservice').value;
const location = document.getElementById('flocation').value;
const message = document.getElementById('fmessage').value;

if(!name || !phone){
alert("Please enter your name and phone number");
return;
}

// Razorpay payment
var options = {

key: "rzp_live_SOFjRPAj8NXqRQ",

amount: 1000, // ₹500

currency: "INR",

name: "Moon Marine Services",

description: "Advance Service Booking",

prefill:{
name:name,
contact:phone
},

handler:function(response){

alert("Payment Successful!");

sendBookingEmail(name,phone,service,location,message,response.razorpay_payment_id);

}

};

var rzp = new Razorpay(options);
rzp.open();

}

function sendBookingEmail(name,phone,service,location,message,paymentId){

const formData = new FormData();

formData.append("name", name);
formData.append("phone", phone);
formData.append("service", service);
formData.append("location", location);
formData.append("message", message);
formData.append("payment_id", paymentId);

formData.append("_subject", "New Moon Marine Booking - Payment Received");
formData.append("_captcha", "false");

fetch("https://formsubmit.co/ajax/moonmarinenavicationcomunicati@gmail.com", {
method: "POST",
body: formData
})
.then(response => response.json())
.then(data => {

alert("Booking confirmed! We will contact you soon.");

// reset form
document.getElementById("fname").value="";
document.getElementById("fphone").value="";
document.getElementById("fservice").value="";
document.getElementById("flocation").value="";
document.getElementById("fmessage").value="";

})
.catch(error => {
console.error(error);
alert("Payment successful but email sending failed.");
});

}
