"use strict";
import { createIcons, UsersRound, Phone } from 'lucide';

const addForm = document.querySelector("#add-form");
const formTitle = document.querySelector("#form-title");
const itemTitle = document.querySelector("#title");
const itemDescription = document.querySelector("#description");
const itemPrice = document.querySelector("#price");
const message = document.querySelector("#message");
const confirmation = document.querySelector("#confirmation");
const logoutBtn = document.querySelector("#logout-btn");
const loader = document.querySelector("#loader");
let currentId = null;

loader.classList.remove("hidden");
fetchMenu();
fetchBookings();

addForm.addEventListener("submit", submit);

function submit(event) {
    event.preventDefault();

    // Kontroll om id finns för att avgöra om rätt ska skapas eller uppdateras
    if (currentId === null) {
        createItem();
    } else {
        updateItem(currentId);
    }
}

// Skapa ny rätt
async function createItem() {
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const userToken = sessionStorage.getItem("user_token");

    // Validering
    if (!itemTitle.value.trim() || !itemDescription.value.trim() || !itemPrice.value) {
        message.textContent = "Fyll i namn på pizza, beskrivning samt pris";
        return;
    }

    let item = {
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

        if (response.ok) {
            confirmation.textContent = "Ny rätt skapad";
            addForm.reset();
            fetchMenu();
        } else {
            throw error;
        }
    } catch (error) {
        message.textContent = "Rätten kunde inte skapas";
    }
}

// Hämta meny
async function fetchMenu() {
    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu");
        const menu = await response.json();

        if (!menu) return;

        displayMenuAdmin(menu);
    } catch (error) {
        console.error("Något gick fel:" + error)
    } finally {
        loader.classList.add("hidden");
    }
}

// Skriv ut meny
function displayMenuAdmin(menu) {
    const menuList = document.querySelector(".menu-list");
    menuList.innerHTML = "";

    menu.forEach(item => {
        const liEl = document.createElement("li");
        liEl.classList.add("list-item");

        const spanContentEl = document.createElement("span");
        const spanButtonsEl = document.createElement("span");
        spanButtonsEl.classList.add("span-btn");

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

async function updateItem(id) {
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const userToken = sessionStorage.getItem("user_token");

    // Validering
    if (!itemTitle.value.trim() || !itemDescription.value.trim() || !itemPrice.value) {
        message.textContent = "Fyll i namn på pizza, beskrivning samt pris";
        return;
    }

    let item = {
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
            addForm.reset();
            confirmation.textContent = "Rätten uppdaterad";
            fetchMenu();
        }
    } catch (error) {
        message.textContent = "Rätten kunde inte uppdateras";
    }
}

// Ta bort en rätt från menyn
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
        }
    } catch (error) {
        console.error("Något gick fel:" + error);
    }
}

// Utloggning
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("user_token");
    window.location.href = ("index.html");
})

async function fetchBookings() {
    const userToken = sessionStorage.getItem("user_token");

    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/booking", {
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        });

        const bookings = await response.json();

        if (!bookings) return;

        displayBookings(bookings)
    } catch (error) {
        console.error("Något gick fel:" + error)
    } finally {
        loader.classList.add("hidden");
    }
}

function displayBookings(bookings) {
    const bookingList = document.querySelector(".booking-list");
    bookingList.innerHTML = "";

    bookings.forEach(booking => {
        const liEl = document.createElement("li");
        liEl.classList.add("list-item");

        const spanContentEl = document.createElement("span");
        const spanButtonsEl = document.createElement("span");
        spanButtonsEl.classList.add("span-btn");

        const dateOnly = new Date(booking.date).toLocaleDateString();
        const dateEl = document.createElement("h3");
        dateEl.textContent = `${dateOnly} ${booking.time}`;

        const guestsEl = document.createElement("p");
        guestsEl.innerHTML = `<i data-lucide="users-round" aria-label="Antal gäster"></i> ${booking.guests}`

        const nameEl = document.createElement("p");
        nameEl.classList.add("bold");
        nameEl.textContent = booking.name;
        
        const phoneEl = document.createElement("p");
        phoneEl.innerHTML =`<i data-lucide="phone" aria-label="Telefonnummer"></i> ${booking.phone}`;

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Ta bort";
        deleteBtn.classList.add("btn", "delete-btn");

        spanContentEl.append(dateEl, nameEl, guestsEl, phoneEl);
        spanButtonsEl.append(deleteBtn);
        liEl.append(spanContentEl, spanButtonsEl);
        bookingList.appendChild(liEl);

        deleteBtn.addEventListener("click", () => {
            deleteBooking(booking._id);
        })
    })
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
        }
    } catch (error) {
        console.error("Något gick fel:" + error);
    }
}

