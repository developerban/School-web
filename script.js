/*=========================================
            DOM READY
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
                MOBILE MENU
    =========================================*/

    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");

    if (hamburger) {

        hamburger.addEventListener("click", () => {

            navbar.classList.toggle("active");
            hamburger.classList.toggle("active");

            if (!hamburger.classList.contains("active")) {
                document.querySelectorAll(".dropdown").forEach(dropdown => {
                    dropdown.classList.remove("open");
                    const submenu = dropdown.querySelector(".dropdown-menu");
                    if (submenu) {
                        submenu.style.maxHeight = null;
                    }
                });
            }

        });

    }

    /*=========================================
            MOBILE DROPDOWN
    =========================================*/

    document.querySelectorAll(".dropdown > a").forEach(item => {

        item.addEventListener("click", function (e) {

            if (window.innerWidth <= 768) {

                e.preventDefault();

                const parent = this.parentElement;
                parent.classList.toggle("open");
                
                const submenu = parent.querySelector(".dropdown-menu");
                if (submenu) {
                    if (parent.classList.contains("open")) {
                        submenu.style.maxHeight = submenu.scrollHeight + "px";
                    } else {
                        submenu.style.maxHeight = null;
                    }
                }

            }

        });

    });

    /*=========================================
            CLOSE MENU AFTER CLICK
    =========================================*/

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", function (e) {

            if (window.innerWidth <= 768) {

                if (this.nextElementSibling && this.nextElementSibling.classList.contains("dropdown-menu")) {
                    return;
                }

                navbar.classList.remove("active");
                hamburger.classList.remove("active");

                document.querySelectorAll(".dropdown").forEach(dropdown => {
                    dropdown.classList.remove("open");
                    const submenu = dropdown.querySelector(".dropdown-menu");
                    if (submenu) {
                        submenu.style.maxHeight = null;
                    }
                });

            }

        });

    });

    /*=========================================
            WINDOW RESIZE
    =========================================*/

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            navbar.classList.remove("active");
            hamburger.classList.remove("active");
            
            document.querySelectorAll(".dropdown").forEach(dropdown => {
                dropdown.classList.remove("open");
                const submenu = dropdown.querySelector(".dropdown-menu");
                if (submenu) {
                    submenu.style.maxHeight = null;
                }
            });

        }

    });

    /*=========================================
            SMOOTH SCROLL
    =========================================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

    /*=========================================
            CTA BUTTON
    =========================================*/

    const startBtn = document.getElementById("getStartedBtn");

    if (startBtn) {

        startBtn.addEventListener("click", () => {

            window.location.href = "contact.html";

        });

    }

    /*=========================================
            BACK TO TOP BUTTON
    =========================================*/

    const backBtn = document.createElement("div");

    backBtn.className = "back-to-top";

    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';

    document.body.appendChild(backBtn);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backBtn.classList.add("show");

        } else {

            backBtn.classList.remove("show");

        }

    });

    backBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    /*=========================================
            REVEAL ANIMATION
    =========================================*/

    const reveals = document.querySelectorAll(".reveal");

    function revealElements() {

        reveals.forEach(element => {

            const top = element.getBoundingClientRect().top;

            const windowHeight = window.innerHeight;

            if (top < windowHeight - 120) {

                element.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", revealElements);

    revealElements();

    /*=========================================
            SCALE ANIMATION
    =========================================*/

    const scales = document.querySelectorAll(".scale-up");

    function scaleAnimation() {

        scales.forEach(item => {

            const top = item.getBoundingClientRect().top;

            if (top < window.innerHeight - 80) {

                item.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", scaleAnimation);

    scaleAnimation();

    /*=========================================
            COUNTER
    =========================================*/

    function animateCounter(element, target) {

        let count = 0;

        const speed = target / 80;

        const update = () => {

            count += speed;

            if (count < target) {

                element.innerText = Math.floor(count);

                requestAnimationFrame(update);

            } else {

                element.innerText = target;

            }

        };

        update();

    }

    const statNumbers = document.querySelectorAll(".stat-card h3");

    if (statNumbers.length >= 2) {

        animateCounter(statNumbers[0], 7500);

        statNumbers[0].innerHTML = "7.5K+";

        animateCounter(statNumbers[1], 50);

        statNumbers[1].innerHTML = "50+";

    }

    /*=========================================
            RIPPLE EFFECT
    =========================================*/

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", function (e) {

            const circle = document.createElement("span");

            const diameter = Math.max(this.clientWidth, this.clientHeight);

            circle.style.width = circle.style.height = diameter + "px";

            circle.style.left = e.offsetX - diameter / 2 + "px";

            circle.style.top = e.offsetY - diameter / 2 + "px";

            circle.classList.add("ripple");

            this.appendChild(circle);

            setTimeout(() => {

                circle.remove();

            }, 600);

        });

    });

    /*=========================================
            ACTIVE NAV LINK
    =========================================*/

    const sections = document.querySelectorAll("section[id]");

    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (pageYOffset >= sectionTop) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /*=========================================
            HEADER SHADOW
    =========================================*/

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.style.boxShadow = "0 10px 35px rgba(0,0,0,.08)";

        } else {

            header.style.boxShadow = "none";

        }

    });

    /*=========================================
            LOADER
    =========================================*/

    const loader = document.querySelector(".loader");

    if (loader) {

        window.addEventListener("load", () => {

            loader.style.opacity = "0";

            loader.style.visibility = "hidden";

            setTimeout(() => {

                loader.remove();

            }, 500);

        });

    }

    /*=========================================
            CONTACT FORM WHATSAPP
    =========================================*/
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

            let isValid = true;

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const program = document.getElementById('contactProgram').value;
            const message = document.getElementById('contactMessage').value.trim();

            if (name === '') {
                document.getElementById('nameError').textContent = 'Please enter your full name.';
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            const phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                document.getElementById('phoneError').textContent = 'Phone number must contain at least 10 digits.';
                isValid = false;
            }

            if (program === '') {
                document.getElementById('programError').textContent = 'Please select a program.';
                isValid = false;
            }

            if (message === '') {
                document.getElementById('messageError').textContent = 'Please enter a message.';
                isValid = false;
            }

            if (isValid) {
                const whatsappNumber = "917321820976";

                const formattedMessage = `🎓 *New Admission Inquiry*

👤 Name:
${name}

📞 Phone:
${phone}

📧 Email:
${email}

📚 Program:
${program}

💬 Message:
${message}`;

                const encodedMessage = encodeURIComponent(formattedMessage);
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                window.open(whatsappURL, '_blank');

                // Reset form
                contactForm.reset();

                // Show success modal
                const modal = document.getElementById('successModal');
                if (modal) {
                    modal.classList.add('active');
                }
            }
        });
    }

    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('successModal').classList.remove('active');
        });
    }

});

/*=========================================
        GLOBAL LIGHTBOX FUNCTIONS
=========================================*/
function openLightbox(src) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    if (modal && img) {
        img.src = src;
        modal.classList.add('active');
    }
}

function closeLightbox(e, force = false) {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        // Close if clicked outside image or if force close (X button) is true
        if (force || e.target === modal) {
            modal.classList.remove('active');
        }
    }
}
