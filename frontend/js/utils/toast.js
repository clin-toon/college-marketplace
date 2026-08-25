export function showToast(type, id, message, duration = 4000) {
  // Find the element using the supplied ID
  const target = document.getElementById(id);

  if (!target) {
    console.error(`Toast target with id "${id}" was not found.`);
    return;
  }

  // Find or create toast container
  let container = document.getElementById(`${id}-toast-container`);

  if (!container) {
    container = document.createElement("div");

    container.id = `${id}-toast-container`;

    container.className =
      "fixed right-5 top-5 z-[9999] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3";

    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");

    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  const isSuccess = type === "success";

  toast.className = `
    flex items-start gap-3 w-full rounded-xl border bg-white
    px-4 py-3.5 shadow-lg
    transition-all duration-300 ease-out
    translate-x-8 opacity-0
    ${isSuccess ? "border-green-200" : "border-red-200"}
  `;

  const icon = isSuccess
    ? `
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </div>
    `
    : `
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
    `;

  const title = isSuccess ? "Success" : "Error";

  toast.innerHTML = `
    ${icon}

    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-slate-900">
        ${title}
      </p>

      <p class="mt-0.5 text-xs leading-5 text-slate-500 toast-message"></p>
    </div>

    <button
      type="button"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md
             text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label="Close notification"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  // Safely insert message
  toast.querySelector(".toast-message").textContent = message;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-8", "opacity-0");
    toast.classList.add("translate-x-0", "opacity-100");
  });

  let timeout;

  const removeToast = () => {
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("translate-x-8", "opacity-0");

    setTimeout(() => {
      toast.remove();

      // Remove empty container
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  };

  // Close button
  toast.querySelector("button").addEventListener("click", () => {
    clearTimeout(timeout);
    removeToast();
  });

  // Auto remove
  timeout = setTimeout(removeToast, duration);
}
