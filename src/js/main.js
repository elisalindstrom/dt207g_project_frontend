"use strict";

// Navigering mobil
const menuBtn = document.querySelector("#menu-btn");
const nav = document.querySelector(".nav");
const mobileMenuLinks = document.querySelectorAll(".nav-links a");

// Meny
const menuList = document.querySelector(".menu-content");
const emptyState = document.querySelector(".empty-state");

// Formulär
const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#booking-date");
const bookingTime = document.querySelector("#booking-time");
const bookingGuests = document.querySelector("#booking-guests");
const bookingName = document.querySelector("#booking-name");
const bookingPhone = document.querySelector("#booking-phone");
const message = document.querySelector("#error");
const confirmation = document.querySelector("#booking-confirmation");

// Loader
const loader = document.querySelector("#loader");
loader.classList.remove("hidden");

fetchMenu();

// Navigering mobil
menuBtn.addEventListener("click", function () {
    nav.classList.toggle("active");
    menuBtn.classList.toggle("active");

    const expanded = nav.classList.contains("active");

    menuBtn.setAttribute("aria-expanded", expanded);

    // Kontroll om expanded är true eller false för att ändra aria-label
    menuBtn.setAttribute("aria-label", expanded ? "Stäng meny" : "Öppna meny");
})

mobileMenuLinks.forEach(link => {
    link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuBtn.classList.remove("active");

        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Öppna meny");
    });
});

// Hämta meny
async function fetchMenu() {
    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu");

        if (!response.ok) {
            throw new Error("Kunde inte hämta menyn");
        }

        const menu = await response.json();
        displayMenu(menu);
    } catch (error) {
        console.error(error);
        // Empty state-hantering
        emptyState.classList.remove("hidden");
        emptyState.innerHTML = `Menyn kan inte hämtas just nu, försök igen lite senare.`
    } finally {
        loader.classList.add("hidden");
    }
}

// Skriva ut meny
function displayMenu(menu) {
    menuList.innerHTML = "";

    // Empty state-hantering
    if (menu.length === 0) {
        emptyState.classList.remove("hidden");
        emptyState.innerHTML = `Menyn är tom!`;
        return;
    }

    emptyState.classList.add("hidden");

    menu.forEach(item => {
        menuList.innerHTML +=
            `<div class="menu-item">
            <div class="item-header">
              <h3>${item.title}</h3>
              <p>${item.price}</p>
            </div>
            <p>${item.description}</p>
          </div>`
    })
}

// Validering för bokningsformuläret
bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const today = new Date().toISOString().split('T')[0];
    let errors = [];

    // Validering datum
    if (!bookingDate.value.trim()) {
        errors.push("Välj datum");
        bookingDate.classList.add("input-error");
    } else if (bookingDate.value < today) {
        errors.push("Valt datum har passerat");
        bookingDate.classList.add("input-error");
    } else {
        bookingDate.classList.remove("input-error");
    }

    // Tid
    if (!bookingTime.value.trim()) {
        errors.push("Välj tid");
        bookingTime.classList.add("input-error");
    } else {
        bookingTime.classList.remove("input-error");
    }

    // Gäster
    if (!bookingGuests.value) {
        errors.push("Välj antal gäster");
        bookingGuests.classList.add("input-error");
    } else {
        bookingGuests.classList.remove("input-error");
    }

    // Namn
    if (!bookingName.value.trim()) {
        errors.push("Namn måste anges");
        bookingName.classList.add("input-error");
    } else if (bookingName.value.trim().length < 2) {
        errors.push("Namn måste vara minst 2 tecken långt");
        bookingName.classList.add("input-error");
    } else {
        bookingName.classList.remove("input-error");
    }

    // Telefonnummer
    if (!bookingPhone.value.trim()) {
        errors.push("Telefonnummer måste anges");
        bookingPhone.classList.add("input-error");
    } else if (bookingPhone.value.trim().length < 7) {
        errors.push("Telefonnummer måste vara minst 7 siffror");
        bookingPhone.classList.add("input-error");
    } else {
        bookingPhone.classList.remove("input-error");
    }

    if (errors.length > 0) {
        message.innerHTML = "";

        errors.forEach(error => {
            let liEl = document.createElement("li");
            liEl.textContent = error;
            message.appendChild(liEl);
        })
        return; // Return vid felmeddelanden
    }

    createBooking();
});

// Skapa ny bokning
async function createBooking() {
    // Bokningsobjekt
    const booking = {
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
            body: JSON.stringify(booking) // Skickar bokningsobjekt som JSON
        })

        const data = await response.json();

        if (response.ok) {
            // Skriver ut bokningsbekräftelse med data från backend
            confirmation.innerHTML = `<h3>${data.message}</h3>
            <p>Datum: ${booking.date}</p>
            <p>Tid: ${booking.time}</p>
            <p>Antal gäster: ${booking.guests}</p>`;

            bookingForm.reset();
        } else {
            // Felmeddelande från backend skickas vidare till catch
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
        message.textContent = "Något gick fel när bokningen skulle genomföras, försök igen om en liten stund.";
    }
}

