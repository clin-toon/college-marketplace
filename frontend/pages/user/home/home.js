async function loadComponent(id, file) {
    const element = document.getElementById(id);

    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
}



loadComponent("navbar", "./customerNavbar.html");
loadComponent("hero", "hero.html");
loadComponent("footer", "./footer.html");
loadComponent("listings", "./topListings.html");