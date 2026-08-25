(() => {
  const RULES = {
    fullName: {
      validate(value) {
        if (!value.trim()) return "Full name is required.";
        if (value.length > 50) {
          return "Full name must be less than 50 characters.";
        }
        const fullNamePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

        if (!fullNamePattern.test(value.trim())) {
          return "Invalid full name.";
        }

        return null;
      },
    },
    email: {
      validate(value) {
        const email = value.trim();

        if (!email) {
          return "Email address is required.";
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@oic\.edu\.np$/;

        if (!emailRegex.test(email)) {
          return "Only @oic.edu.np email addresses are allowed.";
        }

        return null;
      },
    },
    phoneNumber: {
      validate(value) {
        if (!/^9\d{9}$/.test(value)) {
          return "Phone number must be exactly 10 digits and start with 9.";
        }
        return null;
      },
    },
    faculty: {
      validate(value) {
        if (!value.trim()) return "Faculty is required.";
        return null;
      },
    },
    semester: {
      validate(value) {
        if (!value.trim()) return "Semester is required.";
        if (value.length > 8) return "Semester must less than 3 characters.";
        return null;
      },
    },
    password: {
      validate(value) {
        if (value.length < 8)
          return "Password must be at least 8 characters long.";
        if (value.length > 15) return "Password cannot exceed 15 characters.";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(value))
          return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number.";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Password must contain at least one special character.";
        return null;
      },
    },
  };

  const FIELD_IDS = Object.keys(RULES);

  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitLabel = document.getElementById("submitLabel");
  const spinner = document.getElementById("spinner");
  const formStatus = document.getElementById("formStatus");

  const toastContainer = document.getElementById("toastContainer");
  const touched = new Set();

  function showToast(message, type = "success", duration = 4000) {
    if (!toastContainer) return;

    const toast = document.createElement("div");

    const isSuccess = type === "success";

    toast.className = `toast ${isSuccess ? "toast-success" : "toast-error"}`;

    const icon = isSuccess
      ? `
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
    `
      : `
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
    `;

    const title = isSuccess ? "Success" : "Error";

    toast.innerHTML = `
    <div class="toast-icon">
      ${icon}
    </div>

    <div class="toast-content">
      <p class="toast-title">${title}</p>
      <p class="toast-message"></p>
    </div>

    <button
      type="button"
      class="toast-close"
      aria-label="Close notification"
    >
      <svg
        width="16"
        height="16"
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

    // Use textContent instead of innerHTML for the message
    // so user-provided messages cannot inject HTML.
    toast.querySelector(".toast-message").textContent = message;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    const removeToast = () => {
      toast.classList.remove("show");
      toast.classList.add("hide");

      setTimeout(() => {
        toast.remove();
      }, 250);
    };

    // Close button
    toast.querySelector(".toast-close").addEventListener("click", removeToast);

    // Automatically remove
    const timeout = setTimeout(removeToast, duration);

    // Allow mouse hover to pause the timer
    toast.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
    });

    return toast;
  }

  function getInput(fieldId) {
    return document.getElementById(fieldId);
  }

  function getErrorEl(fieldId) {
    return document.getElementById(`${fieldId}-error`);
  }

  function showError(fieldId, message) {
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
    errorEl.classList.add("flex", "animate-fadeSlideIn");
  }

  function clearError(fieldId) {
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
    errorEl.classList.remove("flex", "animate-fadeSlideIn");
  }

  function validateField(fieldId, { silent = false } = {}) {
    const input = getInput(fieldId);
    const message = RULES[fieldId].validate(input.value.trim());

    if (message) {
      if (!silent) showError(fieldId, message);
      return message;
    }

    clearError(fieldId);
    return null;
  }

  const phoneInput = getInput("phoneNumber");
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });

  // Password strength checklist
  const passwordInput = getInput("password");
  const strengthLabel = document.getElementById("strengthLabel");
  const bars = [
    document.getElementById("bar1"),
    document.getElementById("bar2"),
    document.getElementById("bar3"),
  ];

  const PASSWORD_CHECKS = {
    length: (v) => v.length >= 8 && v.length <= 15,
    upper: (v) => /[A-Z]/.test(v),
    lower: (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    special: (v) => /[^A-Za-z0-9]/.test(v),
  };

  function updatePasswordUI(value) {
    let passedCount = 0;

    Object.entries(PASSWORD_CHECKS).forEach(([rule, check]) => {
      const passed = value.length > 0 && check(value);
      if (passed) passedCount += 1;

      const item = document.querySelector(`.req-item[data-rule="${rule}"]`);
      const icon = item.querySelector("svg");

      if (passed) {
        item.classList.remove("text-muted");
        item.classList.add("text-success");
        icon.setAttribute("stroke", "#16A34A");
      } else {
        item.classList.remove("text-success");
        item.classList.add("text-muted");
        icon.setAttribute("stroke", "currentColor");
      }
    });

    const strengthColors = {
      weak: "#DC2626",
      fair: "#D97706",
      strong: "#16A34A",
    };
    let tier = null;

    if (value.length === 0) {
      tier = null;
    } else if (passedCount <= 2) {
      tier = "weak";
    } else if (passedCount <= 4) {
      tier = "fair";
    } else {
      tier = "strong";
    }

    const tierToBars = { weak: 1, fair: 2, strong: 3 };
    const activeBars = tier ? tierToBars[tier] : 0;

    bars.forEach((bar, index) => {
      if (index < activeBars) {
        bar.style.backgroundColor = strengthColors[tier];
      } else {
        bar.style.backgroundColor = "#E2E8F0";
      }
    });

    if (tier) {
      strengthLabel.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);
      strengthLabel.style.color = strengthColors[tier];
    } else {
      strengthLabel.textContent = "—";
      strengthLabel.style.color = "#94A3B8";
    }
  }

  passwordInput.addEventListener("input", () =>
    updatePasswordUI(passwordInput.value),
  );

  // Password visible toogle
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

  // blur for input listeners
  FIELD_IDS.forEach((fieldId) => {
    const input = getInput(fieldId);

    input.addEventListener("blur", () => {
      touched.add(fieldId);
      validateField(fieldId);
    });

    input.addEventListener("input", () => {
      if (
        touched.has(fieldId) ||
        !getErrorEl(fieldId).classList.contains("hidden")
      ) {
        validateField(fieldId);
      }
    });
  });

  // form submission handling
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    spinner.classList.toggle("hidden", !isLoading);
    submitLabel.textContent = isLoading
      ? "Creating account..."
      : "Create Account";
  }

  function showFormStatus(message) {
    formStatus.textContent = message;
    formStatus.classList.remove("hidden");
  }

  function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.classList.add("hidden");
  }

  /**
   * Placeholder for the real API call. Wire this up to the
   * Express backend once the endpoint is available — see the
   * integration notes at the bottom of this file.
   
**/

  async function registerUser(data) {
    const response = await fetch("http://localhost:3000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.message || "Registration failed");
      error.status = response.status;
      error.fieldErrors = result.errors;
      throw error;
    }

    return result;
  }

  /**
   * Maps backend error responses onto the relevant fields, or
   * falls back to a form-level message. Adjust the shape here
   * once the real API error format is known.
   **/

  function handleServerErrors(error) {
    if (error.status === 400 && error.fieldErrors) {
      Object.entries(error.fieldErrors).forEach(([fieldId, message]) => {
        if (RULES[fieldId]) showError(fieldId, message);
      });
      showFormStatus("Please fix the highlighted fields and try again.");
      return;
    }

    if (error.status === 409) {
      showFormStatus(
        "An account with this email or phone number already exists.",
      );
      return;
    }

    if (error.status === 500) {
      showFormStatus(
        "Something went wrong on our end. Please try again shortly.",
      );
      return;
    }

    if (error.status === undefined && error.message === "Failed to fetch") {
      showFormStatus("Network error — check your connection and try again.");
      return;
    }

    showFormStatus(error.message || "Something went wrong. Please try again.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormStatus();

    let firstInvalidField = null;
    let hasErrors = false;

    FIELD_IDS.forEach((fieldId) => {
      touched.add(fieldId);
      const message = validateField(fieldId);
      if (message && !hasErrors) {
        firstInvalidField = fieldId;
        hasErrors = true;
      } else if (message) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      getInput(firstInvalidField).focus();
      return;
    }

    const payload = {
      fullName: getInput("fullName").value.trim(),
      email: getInput("email").value.trim(),
      phoneNumber: getInput("phoneNumber").value.trim(),
      faculty: getInput("faculty").value.trim(),
      semester: getInput("semester").value.trim(),
      password: getInput("password").value,
    };

    setLoading(true);

    localStorage.setItem("email", getInput("email").value.trim());
    try {
      const res = await registerUser(payload);

      showToast(res.message, "success");
      setTimeout(() => {
        window.location.href = "/frontend/pages/verifyOTP.html";
      }, 2500);
    } catch (error) {
      localStorage.removeItem("email");
      handleServerErrors(error);
    } finally {
      setLoading(false);
    }
  });
})();
