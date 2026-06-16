"use strict";

// Navigering mobil
const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector(".nav");
const mobileMenuLinks = document.querySelectorAll(".nav-links a");

// Formulär
const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#booking-date");
const bookingTime = document.querySelector("#booking-time");
const bookingGuests = document.querySelector("#booking-guests");
const bookingName = document.querySelector("#booking-name");
const bookingPhone = document.querySelector("#booking-phone");
const message = document.querySelector("#message");
const confirmation = document.querySelector("#booking-confirmation");
const bookingBtn = document.querySelector("#booking-btn");

const loader = document.querySelector("#loader");
loader.classList.remove("hidden");

fetchMenu();

// Navigering mobil
menuBtn.addEventListener("click", function () {
    nav.classList.toggle("active");
    const expanded = nav.classList.contains("active");

    menuBtn.setAttribute("aria-expanded", expanded);

    // Kontroll om expanded är true eller false för att ändra aria-label
    menuBtn.setAttribute("aria-label", expanded ? "Stäng meny" : "Öppna meny");
})

mobileMenuLinks.forEach(link => {
    link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Öppna meny");
    });
});

// Hämta meny
async function fetchMenu() {
    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu");
        const menu = await response.json();

        if (!menu) return;

        displayMenu(menu);
    } catch (error) {
        console.error("Något gick fel:" + error)
    } finally {
        loader.classList.add("hidden");
    }
}

// Skriva ut meny
function displayMenu(menu) {
    const menuList = document.querySelector(".menu-content");
    menuList.innerHTML = "";

    menu.forEach(item => {
        menuList.innerHTML +=
            `<div class="menu-item">
            <span class="item-header">
              <h3>${item.title}</h3>
              <p>${item.price}</p>
            </span>
            <p>${item.description}</p>
          </div>`
    })
}

bookingForm.addEventListener("submit", createBooking);

// Skapa ny bokning
async function createBooking(event) {
    event.preventDefault();
    message.innerHTML = "";
    confirmation.innerHTML = "";

    // Validering
    if (!bookingDate.value.trim() || !bookingTime.value.trim() || !bookingGuests.value || !bookingName.value.trim() || !bookingPhone.value.trim()) {
        message.textContent = "Fyll i datum, tid, antal gäster, namn och telefonnummer";
        return;
    }

    let booking = {
        date: bookingDate.value.trim(),
        time: bookingTime.value.trim(),
        guests: bookingGuests.value,
        name: bookingName.value.trim(),
        phone: bookingPhone.value.trim()
    };

    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(booking)
        })

        const data = await response.json();

        if (response.ok) {
            confirmation.innerHTML = `<h3>${data.message}</h3>
            <p>Datum: ${booking.date}</p>
            <p>Tid: ${booking.time}</p>
            <p>Antal gäster: ${booking.guests}</p>`;
            bookingForm.reset();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        message.textContent = error.message;
    }
}