"use strict";

// Inloggning
const loginForm = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");

loginForm.addEventListener("submit", loginUser);

async function loginUser(e) {
    e.preventDefault();
    message.innerHTML = "";

    if (!username.value.trim() || !password.value.trim()) {
        message.textContent = "Fyll i användarnamn och lösenord";
        return;
    }

    let user = {
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

        if (response.ok) {
            const data = await response.json();

            sessionStorage.setItem("user_token", data.response.token);
            window.location.href = "admin.html";
        } else {
            throw error;
        }

        loginForm.reset();
    } catch (error) {
        message.textContent = "Felaktigt användarnamn eller lösenord";
    }
}