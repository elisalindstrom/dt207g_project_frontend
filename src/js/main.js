"use strict";

const loader = document.querySelector("#loader");
loader.classList.remove("hidden");

fetchMenu();

// Hämta meny
async function fetchMenu() {
    try {
        const response = await fetch("https://dt207g-project-backend-hbda.onrender.com/api/menu");
        const menu = await response.json();

        if (!menu) return;

        displayMenu(menu);
    } catch (error) {
        console.error("Något gick fel:" + error)
    }
}

// Skriva ut meny
function displayMenu(menu) {
    const menuList = document.querySelector(".menu-content");
    menuList.innerHTML = "";
    loader.classList.add("hidden");

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