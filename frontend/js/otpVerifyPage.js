import { showToast } from "./utils/toast.js";

(() => {
  "use strict";

  const form = document.getElementById("otpForm");
  const boxes = Array.from(document.querySelectorAll(".otp-box"));
  const otpError = document.getElementById("otpError");
  const otpErrorText = document.getElementById("otpErrorText");
  const otpSuccess = document.getElementById("otpSuccess");
  const verifyBtn = document.getElementById("verifyBtn");
  const verifyLabel = document.getElementById("verifyLabel");
  const verifySpinner = document.getElementById("verifySpinner");
  const resendBtn = document.getElementById("resendBtn");
  const resendLabel = document.getElementById("resendLabel");
  const getEmailofInitiator = document.getElementById("maskedEmail");

  const RESEND_COOLDOWN_SECONDS = 60;
  let resendTimer = null;

  const getEmailForTheInitiator = () => {
    const email = localStorage.getItem("email");
    getEmailofInitiator.innerText = email;
    return email;
  };

  getEmailForTheInitiator();

  function getCode() {
    return boxes.map((box) => box.value).join("");
  }

  function clearError() {
    otpError.classList.add("hidden");
    otpError.classList.remove("flex");
    boxes.forEach((box) => {
      box.classList.remove(
        "border-danger",
        "focus:border-danger",
        "focus:ring-danger/10",
        "animate-shake",
      );
      box.classList.add(
        "border-border",
        "focus:border-primary",
        "focus:ring-primary/10",
      );
    });
  }

  function showError(message) {
    otpErrorText.textContent = message;
    otpError.classList.remove("hidden");
    otpError.classList.add("flex");

    boxes.forEach((box) => {
      box.classList.remove(
        "border-border",
        "focus:border-primary",
        "focus:ring-primary/10",
      );
      box.classList.add(
        "border-danger",
        "focus:border-danger",
        "focus:ring-danger/10",
        "animate-shake",
      );
    });

    // Remove the shake animation class after it plays so it can
    // replay on a subsequent failed attempt.
    setTimeout(
      () => boxes.forEach((box) => box.classList.remove("animate-shake")),
      400,
    );
  }

  boxes.forEach((box, index) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^0-9]/g, "").slice(-1);

      if (otpError.classList.contains("flex")) clearError();

      if (box.value && index < boxes.length - 1) {
        boxes[index + 1].focus();
      }

      // Auto-submit once all six boxes are filled.
      if (getCode().length === boxes.length) {
        form.requestSubmit();
      }
    });

    box.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !box.value && index > 0) {
        boxes[index - 1].focus();
      } else if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        boxes[index - 1].focus();
      } else if (event.key === "ArrowRight" && index < boxes.length - 1) {
        event.preventDefault();
        boxes[index + 1].focus();
      }
    });

    box.addEventListener("focus", () => box.select());

    box.addEventListener("paste", (event) => {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, boxes.length);

      if (!pasted) return;

      pasted.split("").forEach((digit, i) => {
        if (boxes[i]) boxes[i].value = digit;
      });

      const nextEmptyIndex =
        pasted.length < boxes.length ? pasted.length : boxes.length - 1;
      boxes[nextEmptyIndex].focus();

      if (otpError.classList.contains("flex")) clearError();

      if (getCode().length === boxes.length) {
        form.requestSubmit();
      }
    });
  });

  // Autofocus the first box on load.
  boxes[0].focus();

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function startResendCooldown() {
    let remaining = RESEND_COOLDOWN_SECONDS;
    resendBtn.disabled = true;
    resendLabel.textContent = `Resend in ${formatTime(remaining)}`;

    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendBtn.disabled = false;
        resendLabel.textContent = "Resend code";
      } else {
        resendLabel.textContent = `Resend in ${formatTime(remaining)}`;
      }
    }, 1000);
  }

  resendBtn.addEventListener("click", async () => {
    resendBtn.disabled = true;
    resendLabel.textContent = "Sending…";

    try {
      await resendCode();
      boxes.forEach((box) => (box.value = ""));
      clearError();
      boxes[0].focus();
      startResendCooldown();
    } catch (error) {
      showError(
        error.message || "Could not resend the code. Please try again.",
      );
      resendBtn.disabled = false;
      resendLabel.textContent = "Resend code";
    }
  });

  startResendCooldown();

  function setLoading(isLoading) {
    verifyBtn.disabled = isLoading;
    verifySpinner.classList.toggle("hidden", !isLoading);
    verifyLabel.textContent = isLoading ? "Verifying..." : "Verify Account";
  }

  async function verifyOtp(code) {
    let emailId = getEmailForTheInitiator();

    if (!emailId) {
      showError("Please provide email address via sign up page. ");
      return;
    }

    const response = await fetch(
      "http://localhost:3000/api/v1/auth/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailId,
          otp: code.toString(),
        }),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.message || "Verification failed");
      error.status = response.status;
      throw error;
    }
    localStorage.removeItem("email");

    return result;
  }

  /**
   * Placeholder for triggering a fresh code from the backend.
   */
  async function resendCode() {
    // TODO: connect to backend API
    //
    // const response = await fetch('/api/auth/resend-otp', { method: 'POST' });
    // if (!response.ok) {
    //   const result = await response.json().catch(() => ({}));
    //   throw new Error(result.message || 'Could not resend the code.');
    // }
    // return response.json();

    return Promise.resolve();
  }

  function handleVerifyError(error) {
    if (error.status === 400) {
      console.log(error);
      showError("The code you entered is incorrect. Please try again.");
    } else if (error.status === 410) {
      showError("This code has expired. Request a new one below.");
    } else if (error.status === 429) {
      showError("Too many attempts. Please wait a moment before trying again.");
    } else if (
      error.status === undefined &&
      error.message === "Failed to fetch"
    ) {
      showError("Network error — check your connection and try again.");
    } else {
      showError(error.message || "Something went wrong. Please try again.");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const code = getCode();
    if (code.length !== boxes.length) {
      showError("Enter all 6 digits to continue.");
      boxes[code.length].focus();
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp(code);
      showToast("success", "toastContainer", data.message);
      otpSuccess.classList.remove("hidden");
      otpSuccess.classList.add("flex");
      boxes.forEach((box) => (box.disabled = true));

      setTimeout(() => {
        window.location.href = "/frontend/pages/login.html";
      }, 2500);
    } catch (error) {
      handleVerifyError(error);
      boxes.forEach((box) => (box.value = ""));
      boxes[0].focus();
    } finally {
      setLoading(false);
    }
  });
})();
