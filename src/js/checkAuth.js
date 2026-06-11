"use strict";

// Om ingen token finns sparad skickas användaren till inloggningssidan
if (!sessionStorage.getItem("user_token")) {
    window.location.href = "login.html";
}