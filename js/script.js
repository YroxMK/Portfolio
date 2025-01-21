
$(document).ready(function() {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000"
    };
});


/*==================== toggle icon navbar ====================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick =() =>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*==================== scroll sections active link ====================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {

    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*='+id +']').classList.add('active');
            });
        };
    });
    /*==================== sticky navbar ====================*/

    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);


    /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


/*==================== scroll reveal ====================*/

ScrollReveal({
    //reset:true,  // every time loads transition running
    distance: '80px',
    duration:2000,
    delay:200

});

ScrollReveal().reveal('.home-content, .heading',{origin:'top'});
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form',{origin:'bottom'});

ScrollReveal().reveal('.home-content h1 ,.subheading , .about-img ',{origin:'left'});
ScrollReveal().reveal('.home-content p , .about-content',{origin:'right'});

 

/*==================== typed js ====================*/

const typed = new Typed('.multiple-text',{
    strings:['Software Engineer','ASP.NET Developer','IT Support Specialist' , 'Multimedia Designer'],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});


 

/*emailSend*/
function sendMail() {

    let submitButton = document.getElementById("submit-btn");
    submitButton.disabled = true;
    submitButton.value = "Sending..."; // Change button text while processing


    let subject = document.getElementById("subject").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let mobile = document.getElementById("mobile").value;
    let message = document.getElementById("message").value;

    // Form validation
    if (!subject || !name || !email || !mobile || !message) {
        toastr.error("Please fill in all required fields.");
         // Re-enable the submit button
         submitButton.disabled = false;
         submitButton.value = "Send Message"; // Reset button text
        return;
    }

    let params = { subject, name, email, mobile, message };

    emailjs.send("service_wqfc5ub", "template_rqtfq7g", params)
    .then(function(response) {
        toastr.success("Thank you for your email! I will get back to you soon.");
         // Re-enable the submit button
         submitButton.disabled = false;
         submitButton.value = "Send Message"; // Reset button text
    })
    .catch(function(error) {
        toastr.error("Failed to send your email. Please try again later.");
         // Re-enable the submit button
         submitButton.disabled = false;
         submitButton.value = "Send Message"; // Reset button text
    });
}
