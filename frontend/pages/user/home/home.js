import { requireAuth } from "../../../routeMiddleware.js";

(async function init() {
  const user = await requireAuth();
  if (!user) return;

  document.getElementById("user-email").textContent = user.email;
  document.getElementById("app").style.display = "block";

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/frontend/pages/login.html";
  });
})();

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
