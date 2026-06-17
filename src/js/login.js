"use strict";

// Inloggning
const loginForm = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");
const loader = document.querySelector("#loader");

loginForm.addEventListener("submit", loginUser);

async function loginUser(event) {
    event.preventDefault();
    message.innerHTML = "";

    // Validering input
    if (!username.value.trim() || !password.value.trim()) {
        message.innerHTML = `<li>Fyll i användarnamn och lösenord</li>`;
        return;
    }

    loader.classList.remove("hidden");

    const user = {
        username: username.value.trim(),
        password: password.value.trim()
    }

    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            throw new Error("Inloggningen misslyckades");
        }
        const data = await response.json();

        // Vid lyckad inloggning sparas token i sessionStorage
        sessionStorage.setItem("user_token", data.response.token);
        window.location.href = "admin.html";
    } catch (error) {
        console.error(error);
        message.innerHTML = `<li>Felaktigt användarnamn eller lösenord</li>`;
    } finally {
        loader.classList.add("hidden");
    }
}