# DT207G projektuppgift - Buster pizzeria
Webbplats utvecklad med Vite som konsumerar data från en extern REST-webbtjänst. Besökare kan se restaurangens meny samt göra bordsbokningar. Webbplatsen har också ett administratörsgränssnitt där personal kan logga in och hantera meny och bokningar.

## Installation
Efter nedklonat repository installeras beroenden med kommando npm install. Utvecklingsserver startas med kommando npm run dev.

## Länk till liveversion
https://bustergbg.onrender.com/

## Funktionalitet
- Restaurangens meny hämtas från extern webbtjänst
- Besökare kan göra bordsbokningar (extra funktionalitet)
- Formulär valideras innan data skickas till webbtjänsten
- Administratörer kan lägga till, redigera samt ta bort rätter från menyn
- Administratörer kan se, lägga till, redigera och ta bort bokningar (extra funktionalitet)
- Skyddade funktioner nås av administratörer efter inlogg med JWT-autentisering

Av Elisa L. 2026