"use strict";

const addForm = document.querySelector("#add-form");
const itemTitle = document.querySelector("#title");
const itemDescription = document.querySelector("#description");
const itemPrice = document.querySelector("#price");
const message = document.querySelector("#message");
const confirmation = document.querySelector("#confirmation");

addForm.addEventListener("submit", createItem);

// Utloggning
const logoutBtn = document.querySelector("#logout-btn");

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("user_token");
    window.location.href = ("index.html");
})

// Skapa ny rätt
async function createItem(event) {
    event.preventDefault();
    message.innerHTML = "";
    confirmation.innerHTML = "";
    const userToken = sessionStorage.getItem("user_token");

    // Validering
    if (!itemTitle.value.trim() || !itemDescription.value.trim() || !itemPrice.value) {
        message.textContent = "Fyll i namnet på pizzan, beskrivning och pris";
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
            console.log(item);
            console.log(await response.text());

            addForm.reset();
        } else {
            throw error;
        }
    } catch (error) {
        message.textContent = "Rätten kunde inte skapas";
    }
}