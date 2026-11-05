/* ==========================================================================
   BIT-SEDA STUDIO · main.js
   JavaScript vanilla (sin dependencias):
   1. Menú móvil accesible
   2. Aparición de elementos al hacer scroll
   3. Formulario de contacto (validación + envío opcional a un endpoint)
   ========================================================================== */
(() => {
  "use strict";

  const DEBUG = false;
  const log = (...args) => DEBUG && console.log(...args);

  /* ---------- 1. Menú móvil ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Cerrar con Escape (y devolver el foco al botón) o al elegir un enlace
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    // Si se agranda la ventana, restablecer
    window.matchMedia("(min-width: 1101px)").addEventListener("change", (m) => {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- 2. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------- 3. Formulario de contacto ---------- */
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const formStartedAt = Date.now();
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.querySelector("span");
  const fields = [...form.querySelectorAll(".form-control")];

  // Preselecciona el servicio con ?servicio=web|fotolito|insumos
  const wanted = new URLSearchParams(location.search).get("servicio");
  const select = form.elements.service;
  if (wanted && [...select.options].some((o) => o.value === wanted)) {
    select.value = wanted;
  }

  const MESSAGES = {
    valueMissing: "Este campo es obligatorio.",
    typeMismatch: "Revisa el formato (ej. nombre@correo.com).",
    tooShort: "Escribe un poco más de detalle.",
  };

  const validateField = (field) => {
    const v = field.validity;
    const error = field.parentElement.querySelector(".field-error");
    const message = v.valid
      ? ""
      : v.valueMissing ? MESSAGES.valueMissing
      : v.typeMismatch ? MESSAGES.typeMismatch
      : v.tooShort ? MESSAGES.tooShort
      : field.validationMessage;
    field.setAttribute("aria-invalid", String(!v.valid));
    if (error) error.textContent = message;
    return v.valid;
  };

  fields.forEach((f) => {
    f.addEventListener("blur", () => validateField(f));
    f.addEventListener("input", () => {
      if (f.getAttribute("aria-invalid") === "true") validateField(f);
    });
  });

  const showStatus = (html, isError = false) => {
    status.innerHTML = html;
    status.classList.toggle("is-error", isError);
    status.classList.add("is-visible");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("is-visible");

    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    // Honeypot: si un bot lo rellena, fingimos éxito y no enviamos nada
    if (form.elements.website && form.elements.website.value) return;

    const endpoint = form.dataset.endpoint; // p. ej. https://formspree.io/f/xxxxxxxx
    submitBtn.disabled = true;
    submitLabel.textContent = "TRANSMITIENDO...";

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showStatus("> TRANSMISIÓN RECIBIDA. Te responderemos pronto.");
      } else {
        // Modo demo: no existe backend, nada sale del navegador.
        await new Promise((r) => setTimeout(r, 700));
        showStatus(
          "> TRANSMISIÓN SIMULADA OK." +
            "<small>Modo demo: este sitio es un proyecto de portafolio y no envía datos a ningún servidor.</small>"
        );
      }
      form.reset();
      fields.forEach((f) => f.removeAttribute("aria-invalid"));
    } catch (err) {
      showStatus("> ERROR DE CONEXIÓN. Inténtalo de nuevo en unos minutos.", true);
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "EJECUTAR ENVÍO ();";
    }
  });
})();
