"use strict";
import { createIcons, UsersRound, Phone } from 'lucide'; // Import ikoner

//Formulär Bokningar
const bookingFormTitle = document.querySelector("#booking-form-title")
const bookingForm = document.querySelector("#booking-form");
const bookingDate = document.querySelector("#booking-date");
const bookingTime = document.querySelector("#booking-time");
const bookingGuests = document.querySelector("#booking-guests");
const bookingName = document.querySelector("#booking-name");
const bookingPhone = document.querySelector("#booking-phone");
const bookingMessage = document.querySelector("#booking-error");
const bookingConfirmation = document.querySelector("#booking-confirmation");

// Utskrift Bokningar
const bookingList = document.querySelector(".booking-list");
const emptyState = document.querySelector(".empty-state");

// Formulär Meny
const addForm = document.querySelector("#add-form");
const addFormTitle = document.querySelector("#add-form-title");
const itemTitle = document.querySelector("#title");
const itemDescription = document.querySelector("#description");
const itemPrice = document.querySelector("#price");
const message = document.querySelector("#error");
const confirmation = document.querySelector("#confirmation");

// Utskrift Meny
const menuList = document.querySelector(".menu-list");
const emptyStateMenu = document.querySelector(".empty-state-menu")

const logoutBtn = document.querySelector("#logout-btn");
const loader = document.querySelector("#loader");

let currentIdBooking = null;
let currentIdMenu = null;

loader.classList.remove("hidden");

fetchBookings();
fetchMenu();

/* BOKNINGAR */

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

        const changeBtn = document.createElement("button")
        changeBtn.textContent = "Ändra";
        changeBtn.classList.add("btn", "primary-btn");

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Ta bort";
        deleteBtn.classList.add("btn", "delete-btn");

        contentEl.append(dateEl, nameEl, guestsEl, phoneEl);
        buttonsEl.append(changeBtn, deleteBtn);
        liEl.append(contentEl, buttonsEl);
        bookingList.appendChild(liEl);

        changeBtn.addEventListener("click", () => {
            // Fyll i värden i formuläret
            bookingDate.value = dateOnly;
            bookingTime.value = booking.time;
            bookingGuests.value = booking.guests;
            bookingName.value = booking.name;
            bookingPhone.value = booking.phone;
            currentIdBooking = booking._id;

            bookingDate.classList.remove("input-error");
            bookingTime.classList.remove("input-error");
            bookingGuests.classList.remove("input-error");
            bookingName.classList.remove("input-error");
            bookingPhone.classList.remove("input-error");

            bookingMessage.innerHTML = "";
            bookingConfirmation.innerHTML = "";
            bookingFormTitle.textContent = "Redigera bokning";

            // Scroll till formulär vid klick
            bookingFormTitle.scrollIntoView({ behavior: "smooth" });
        })

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

// Kontroll om id finns för att avgöra hur formuläret ska användas (ny bokning eller uppdatera bokning)
bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = validateBookingForm();
    if (!booking) return;

    if (currentIdBooking === null) {
        createBooking(booking);
    } else {
        updateBooking(currentIdBooking, booking);
    }
});

// Validering av bokningsformulär
function validateBookingForm() {
    bookingMessage.innerHTML = "";
    bookingConfirmation.innerHTML = "";
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
        bookingMessage.innerHTML = "";

        errors.forEach(error => {
            let liEl = document.createElement("li");
            liEl.textContent = error;
            bookingMessage.appendChild(liEl);
        })
        return null; // Returnerar null vid error
    }
    // Returnerar bokningsobjekt om inga error
    return {
        date: bookingDate.value.trim(),
        time: bookingTime.value.trim(),
        guests: bookingGuests.value,
        name: bookingName.value.trim(),
        phone: bookingPhone.value.trim()
    };
}

// Skapa ny bokning
async function createBooking(booking) {
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
            bookingConfirmation.textContent = "Ny bokning skapad!";
            bookingForm.reset();
            fetchBookings();
        } else {
            // Felmeddelande från backend skickas vidare till catch
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
        bookingMessage.textContent = "Något gick fel när bokningen skulle genomföras, försök igen om en liten stund.";
    }
}

// Uppdatera en bokning
async function updateBooking(id, booking) {
    const userToken = sessionStorage.getItem("user_token");

    try {
        const response = await fetch(`https://dt207g-project-backend-hbda.onrender.com/api/booking/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(booking)
        });

        if (response.ok) {
            currentIdBooking = null;
            bookingFormTitle.textContent = "Lägg till ny bokning";
            bookingConfirmation.textContent = "Bokningen uppdaterad";
            bookingForm.reset();
            fetchBookings();
        } else {
            throw new Error("Kunde inte uppdatera bokningen");
        }
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
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

/* MENY */

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

        const contentEl = document.createElement("div");
        const buttonsEl = document.createElement("div");
        buttonsEl.classList.add("container-btn");

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

        contentEl.append(titleEl, descriptionEl, priceEl);
        buttonsEl.append(changeBtn, deleteBtn);
        liEl.append(contentEl, buttonsEl);
        menuList.appendChild(liEl);

        changeBtn.addEventListener("click", () => {
            // Fyll i värden i formuläret
            itemTitle.value = item.title;
            itemDescription.value = item.description;
            itemPrice.value = item.price;
            currentIdMenu = item._id;

            itemTitle.classList.remove("input-error");
            itemDescription.classList.remove("input-error");
            itemPrice.classList.remove("input-error");

            message.innerHTML = "";
            confirmation.innerHTML = "";
            addFormTitle.textContent = "Redigera rätt";

            // Scroll till formulär vid klick
            addFormTitle.scrollIntoView({ behavior: "smooth" });
        })

        deleteBtn.addEventListener("click", () => {
            deleteMenuItem(item._id);
        })
    })
}

// Kontroll om id finns för att avgöra hur formuläret ska användas (ny rätt eller uppdatera rätt)
addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const item = validateMenuForm();
    if (!item) return;

    if (currentIdMenu === null) {
        createItem(item);
    } else {
        updateItem(currentIdMenu, item);
    }
});

function validateMenuForm() {
    message.innerHTML = "";
    confirmation.innerHTML = "";

    let errors = [];

    // Validering input
    if (!itemTitle.value.trim()) {
        errors.push("Ange namn på pizzan");
        itemTitle.classList.add("input-error");
    } else {
        itemTitle.classList.remove("input-error");
    }

    if (!itemDescription.value.trim()) {
        errors.push("Ange beskrivning av pizzan");
        itemDescription.classList.add("input-error");
    } else {
        itemDescription.classList.remove("input-error");
    }

    if (!itemPrice.value) {
        errors.push("Ange pris");
        itemPrice.classList.add("input-error");
    } else {
        itemPrice.classList.remove("input-error");
    }

    if (errors.length > 0) {
        message.innerHTML = "";

        errors.forEach(error => {
            let liEl = document.createElement("li");
            liEl.textContent = error;
            message.appendChild(liEl);
        })
        return null; // Returnerar null vid error
    }

    // Returnerar menyobjekt om inga error
    return {
        title: itemTitle.value.trim(),
        description: itemDescription.value.trim(),
        price: itemPrice.value
    };
}

// Skapa ny rätt
async function createItem(item) {
    const userToken = sessionStorage.getItem("user_token");

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
        message.textContent = "Rätten kunde inte skapas";
    }
}

// Uppdatera menyalternativ
async function updateItem(id, item) {
    const userToken = sessionStorage.getItem("user_token");

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
            currentIdMenu = null;
            addFormTitle.textContent = "Lägg till ny rätt";
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

/* UTLOGGNING */
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("user_token");
    window.location.href = ("index.html");
})

