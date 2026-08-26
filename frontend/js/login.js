import { showToast } from "./utils/toast.js";

(() => {
  "use strict";

  const form = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginLabel = document.getElementById("loginLabel");
  const loginSpinner = document.getElementById("loginSpinner");

  const formStatus = document.getElementById("formStatus");
  const formStatusText = document.getElementById("formStatusText");
  const formStatusAction = document.getElementById("formStatusAction");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  function getInput(fieldId) {
    return document.getElementById(fieldId);
  }
  function getErrorEl(fieldId) {
    return document.getElementById(`${fieldId}-error`);
  }

  function showFieldError(fieldId, message) {
    const input = getInput(fieldId);
    const errorEl = getErrorEl(fieldId);
    input.classList.remove(
      "border-border",
      "focus:border-primary",
      "focus:ring-primary/10",
    );
    input.classList.add(
      "border-danger",
      "focus:border-danger",
      "focus:ring-danger/10",
    );
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
    errorEl.classList.add("flex");
  }

  function clearFieldError(fieldId) {
    const input = getInput(fieldId);
    const errorEl = getErrorEl(fieldId);
    input.classList.remove(
      "border-danger",
      "focus:border-danger",
      "focus:ring-danger/10",
    );
    input.classList.add(
      "border-border",
      "focus:border-primary",
      "focus:ring-primary/10",
    );
    input.setAttribute("aria-invalid", "false");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    errorEl.classList.remove("flex");
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return (showFieldError("email", "Email is required."), false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return (showFieldError("email", "Invalid email address."), false);
    clearFieldError("email");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (!value)
      return (showFieldError("password", "Password is required."), false);
    clearFieldError("password");
    return true;
  }

  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  emailInput.addEventListener("input", () => {
    if (emailInput.getAttribute("aria-invalid") === "true") validateEmail();
  });
  passwordInput.addEventListener("input", () => {
    if (passwordInput.getAttribute("aria-invalid") === "true")
      validatePassword();
  });

  // Password toogle
  const toggleBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const EYE_OPEN =
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>';
  const EYE_OFF =
    '<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a17.4 17.4 0 0 1-3.16 4.36M6.34 6.34C3.5 8.1 1 12 1 12s4 8 11 8a9.2 9.2 0 0 0 5.31-1.68M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>';

  toggleBtn.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    eyeIcon.innerHTML = isVisible ? EYE_OPEN : EYE_OFF;
    toggleBtn.setAttribute(
      "aria-label",
      isVisible ? "Show password" : "Hide password",
    );
    toggleBtn.setAttribute("aria-pressed", String(!isVisible));
  });

  function showFormStatus(
    message,
    { actionText, actionHref, shake = true } = {},
  ) {
    formStatusText.textContent = message;

    if (actionText && actionHref) {
      formStatusAction.textContent = actionText;
      formStatusAction.href = actionHref;
      formStatusAction.classList.remove("hidden");
    } else {
      formStatusAction.classList.add("hidden");
      formStatusAction.removeAttribute("href");
    }

    formStatus.classList.remove("hidden");
    formStatus.classList.add("flex", "animate-fadeSlideIn");

    if (shake) {
      form.classList.remove("animate-shake");
      // Force reflow so the animation can replay on consecutive failures.
      void form.offsetWidth;
      form.classList.add("animate-shake");
    }
  }

  function clearFormStatus() {
    formStatus.classList.add("hidden");
    formStatus.classList.remove("flex", "animate-fadeSlideIn");
    formStatusText.textContent = "";
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginSpinner.classList.toggle("hidden", !isLoading);
    loginLabel.textContent = isLoading ? "Logging in..." : "Log In";
  }

  async function loginUser(credentials) {
    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.message || "Login failed");
      error.status = response.status;
      error.code = result.code; //
      throw error;
    }
    return result;
  }

  /**
   * Translates whatever the backend sends back into one clear,
   * actionable banner. Adjust the status/code checks here once
   * the real API's error shape is finalized.
   */
  function handleLoginError(error) {
    // Backend flagged specific fields (e.g. 400 with fieldErrors)
    if (error.status === 400 && error.fieldErrors) {
      Object.entries(error.fieldErrors).forEach(([fieldId, message]) => {
        if (fieldId === "email" || fieldId === "password")
          showFieldError(fieldId, message);
      });
      showFormStatus("Please fix the highlighted fields and try again.");
      return;
    }

    switch (error.status) {
      case 401:
        showFormStatus("Incorrect email or password. Please try again.");
        break;

      case 403:
        if (error.code === "ACCOUNT_NOT_VERIFIED") {
          showFormStatus("Your account isn\u2019t verified yet.", {
            actionText: "Verify it now",
            actionHref: "/otp",
          });
        } else {
          showFormStatus(
            "You don\u2019t have permission to log in to this account.",
          );
        }
        break;

      case 404:
        showFormStatus("No account found with this email.", {
          actionText: "Create an account",
          actionHref: "/register",
        });
        break;

      case 429:
        showFormStatus(
          "Too many login attempts. Please wait a few minutes and try again.",
        );
        break;

      case 500:
        showFormStatus(
          "Something went wrong on our end. Please try again shortly.",
        );
        break;

      default:
        if (error.status === undefined && error.message === "Failed to fetch") {
          showFormStatus(
            "Network error \u2014 check your connection and try again.",
          );
        } else {
          showFormStatus(
            error.message || "Something went wrong. Please try again.",
          );
        }
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormStatus();

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      (isEmailValid ? passwordInput : emailInput).focus();
      return;
    }

    const credentials = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    setLoading(true);

    try {
      const res = await loginUser(credentials);
      showToast("success", "toastContainer", res.message);
      setInterval(() => {
        window.location.href = "/frontend/pages/user/home/index.html";
      }, 1500);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  });
})();
