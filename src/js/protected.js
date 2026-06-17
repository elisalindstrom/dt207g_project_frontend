"use strict";
import { createIcons, UsersRound, Phone } from 'lucide'; // Import ikoner

// Bokningar
const bookingList = document.querySelector(".booking-list");
const emptyState = document.querySelector(".empty-state");

// Formulär
const addForm = document.querySelector("#add-form");
const formTitle = document.querySelector("#form-title");
const itemTitle = document.querySelector("#title");
const itemDescription = document.querySelector("#description");
const itemPrice = document.querySelector("#price");
const message = document.querySelector("#error");
const confirmation = document.querySelector("#confirmation");

// Meny
const menuList = document.querySelector(".menu-list");
const emptyStateMenu = document.querySelector(".empty-state-menu")

const logoutBtn = document.querySelector("#logout-btn");
const loader = document.querySelector("#loader");

let currentId = null;

loader.classList.remove("hidden");

fetchBookings();
fetchMenu();

// Hämta meny
async function fetchMenu() {
    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu");

        if (!response.ok) {
            throw new Error("Kunde inte hämta menyn");
        }

        const menu = await response.json();
        displayMenuAdmin(menu);
    } catch (error) {
        console.error(error);
        // Empty state-hantering
        emptyStateMenu.classList.remove("hidden");
        emptyStateMenu.innerHTML = `Menyn kan inte hämtas just nu, försök igen lite senare.`
    }
}

// Hämta bokningar
async function fetchBookings() {
    const userToken = sessionStorage.getItem("user_token");

    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/booking", {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (!response.ok) {
            throw new Error("Kunde inte hämta bokningar");
        }

        const bookings = await response.json();
        displayBookings(bookings)
    } catch (error) {
        console.error(error);
        emptyState.classList.remove("hidden");
        // Empty state-hantering
        emptyState.textContent = "Bokningar kan inte hämtas just nu, försök igen lite senare."
    } finally {
        loader.classList.add("hidden");
    }
}

// Kontroll om id finns för att avgöra hur formuläret ska användas (ny rätt eller uppdatera rätt)
addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentId === null) {
        createItem();
    } else {
        updateItem(currentId);
    }
});

// Skapa ny rätt
async function createItem() {
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const userToken = sessionStorage.getItem("user_token");

    let errors = [];

    // Validering input
    if (!itemTitle.value.trim()) {
        errors.push("Ange namn på pizzan");
    }

    if (!itemDescription.value.trim()) {
        errors.push("Ange beskrivning av pizzan");
    }

    if (!itemPrice.value) {
        errors.push("Ange pris");
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

    const item = {
        title: itemTitle.value.trim(),
        description: itemDescription.value.trim(),
        price: itemPrice.value
    };

    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(item)
        })

        const data = await response.json();

        if (response.ok) {
            confirmation.textContent = "Ny rätt skapad!";
            addForm.reset();
            fetchMenu();
        } else {
            // Felmeddelande från backend skickas vidare till catch
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
        message.textContent = "Rätten kunde inte skapas.";
    }
}

// Uppdatera menyalternativ
async function updateItem(id) {
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const userToken = sessionStorage.getItem("user_token");

    let errors = [];

    // Validering input
    if (!itemTitle.value.trim()) {
        errors.push("Ange namn på pizzan");
    }

    if (!itemDescription.value.trim()) {
        errors.push("Ange beskrivning av pizzan");
    }

    if (!itemPrice.value) {
        errors.push("Ange pris");
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

    const item = {
        title: itemTitle.value.trim(),
        description: itemDescription.value.trim(),
        price: itemPrice.value
    };

    try {
        const response = await fetch(`https://dt207g-project-backend-hbda.onrender.com/api/menu/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(item)
        });

        if (response.ok) {
            currentId = null;
            formTitle.textContent = "Lägg till ny rätt";
            confirmation.textContent = "Rätten uppdaterad";
            addForm.reset();
            fetchMenu();
        } else {
            throw new Error("Kunde inte uppdatera rätten");
        }
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
}

// Skriv ut meny
function displayMenuAdmin(menu) {
    menuList.innerHTML = "";

    // Empty state-hantering
    if (menu.length === 0) {
        emptyStateMenu.classList.remove("hidden");
        emptyStateMenu.innerHTML = `Menyn är tom! Lägg till rätter via formuläret.`;
        return;
    }

    emptyStateMenu.classList.add("hidden");

    menu.forEach(item => {
        const liEl = document.createElement("li");
        liEl.classList.add("list-item");

        const spanContentEl = document.createElement("div");
        const spanButtonsEl = document.createElement("div");
        spanButtonsEl.classList.add("container-btn");

        const titleEl = document.createElement("h3");
        titleEl.textContent = item.title;

        const descriptionEl = document.createElement("p");
        descriptionEl.textContent = item.description;

        const priceEl = document.createElement("p");
        priceEl.textContent = item.price;

        const changeBtn = document.createElement("button")
        changeBtn.textContent = "Ändra";
        changeBtn.classList.add("btn", "primary-btn");

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Ta bort";
        deleteBtn.classList.add("btn", "delete-btn");

        spanContentEl.append(titleEl, descriptionEl, priceEl);
        spanButtonsEl.append(changeBtn, deleteBtn);
        liEl.append(spanContentEl, spanButtonsEl);
        menuList.appendChild(liEl);

        changeBtn.addEventListener("click", () => {
            // Fyll i värden i formuläret
            itemTitle.value = item.title;
            itemDescription.value = item.description;
            itemPrice.value = item.price;
            currentId = item._id;

            message.innerHTML = "";
            formTitle.textContent = "Redigera rätt";

            // Scroll till formulär vid klick
            formTitle.scrollIntoView({ behavior: "smooth" });
        })

        deleteBtn.addEventListener("click", () => {
            deleteMenuItem(item._id);
        })
    })
}

// Ta bort en rätt från meny
async function deleteMenuItem(id) {
    const userToken = sessionStorage.getItem("user_token");

    try {
        const response = await fetch(`https://dt207g-project-backend-hbda.onrender.com/api/menu/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (response.ok) {
            fetchMenu();
        } else {
            throw new Error("Rätten kunde inte tas bort");
        }
    } catch (error) {
        console.error(error);
    }
}

// Skriv ut bokningar
function displayBookings(bookings) {
    bookingList.innerHTML = "";

    // Empty state-hantering
    if (bookings.length === 0) {
        emptyState.classList.remove("hidden");
        emptyState.innerHTML = `Inga bokningar finns!`;
        return;
    }

    emptyState.classList.add("hidden");

    bookings.forEach(booking => {
        const liEl = document.createElement("li");
        liEl.classList.add("list-item");

        const contentEl = document.createElement("div");
        const buttonsEl = document.createElement("div");
        buttonsEl.classList.add("container-btn");

        const dateOnly = new Date(booking.date).toLocaleDateString();
        const dateEl = document.createElement("h3");
        dateEl.textContent = `${dateOnly} ${booking.time}`;

        const guestsEl = document.createElement("p");
        guestsEl.innerHTML = `<i data-lucide="users-round" aria-label="Antal gäster"></i> ${booking.guests}`

        const nameEl = document.createElement("p");
        nameEl.classList.add("bold");
        nameEl.textContent = booking.name;

        const phoneEl = document.createElement("p");
        phoneEl.innerHTML = `<i data-lucide="phone" aria-label="Telefonnummer"></i> ${booking.phone}`;

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Ta bort";
        deleteBtn.classList.add("btn", "delete-btn");

        contentEl.append(dateEl, nameEl, guestsEl, phoneEl);
        buttonsEl.append(deleteBtn);
        liEl.append(contentEl, buttonsEl);
        bookingList.appendChild(liEl);

        deleteBtn.addEventListener("click", () => {
            deleteBooking(booking._id);
        })
    })

    // Skapa ikoner
    createIcons({
        icons: {
            UsersRound,
            Phone
        }
    });
}

// Ta bort en bokning
async function deleteBooking(id) {
    const userToken = sessionStorage.getItem("user_token");

    try {
        const response = await fetch(`https://dt207g-project-backend-hbda.onrender.com/api/booking/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        if (response.ok) {
            fetchBookings();
        } else {
            throw new Error("Bokningen kunde inte tas bort");
        }
    } catch (error) {
        console.error(error);
    }
}

// Utloggning
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("user_token");
    window.location.href = ("index.html");
})

