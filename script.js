// =========================================
// HAKANWEBDESIGN
// INTERACTIONS & ANIMATIONS
// =========================================


// =========================================
// MOBILE MENU
// =========================================

const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });


    // Menüdeki linke tıklanınca menüyü kapat
    const links = navLinks.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

        });

    });

}


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements = document.querySelectorAll(
    ".feature, .service-card, .project-card, .process-item, .about-grid, .section-heading"
);

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


// =========================================
// MOUSE GLOW
// =========================================

const mouseGlow = document.createElement("div");

mouseGlow.classList.add("mouse-glow");

document.body.appendChild(mouseGlow);


document.addEventListener("mousemove", (event) => {

    mouseGlow.style.left = event.clientX + "px";

    mouseGlow.style.top = event.clientY + "px";

});


// =========================================
// SMOOTH NAVIGATION
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (event) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


// =========================================
// NAVBAR SCROLL EFFECT
// =========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


// =========================================
// PROJECT CARD TILT
// =========================================

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", (event) => {

        if (window.innerWidth < 800) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;

        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;

        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -2;

        const rotateY =
            ((x - centerX) / centerX) * 2;

        card.style.transform =
            `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


// =========================================
// YEAR AUTO UPDATE
// =========================================

const yearText = document.querySelector(".footer-bottom span");

if (yearText) {

    const currentYear = new Date().getFullYear();

    yearText.textContent =
        `© ${currentYear} HakanWebDesign. Tüm hakları saklıdır.`;

}


// =========================================
// CONSOLE MESSAGE
// =========================================

console.log(
    "HakanWebDesign — Modern Web Design"
);
