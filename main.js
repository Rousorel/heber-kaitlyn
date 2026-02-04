/* ============================================
   Wedding Website - Main JavaScript
   Guest Confirmation System
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// ============================================
// Firebase Initialization
// ============================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase connected successfully");

// ============================================
// DOM Elements
// ============================================

const btnBuscar = document.getElementById("buscarInvitado");
const inputCodigo = document.getElementById("codigo");
const invitadoInfo = document.getElementById("invitado-info");
const nombreInvitado = document.getElementById("nombreInvitado");
const formConfirmacion = document.getElementById("formConfirmacion");
const inputAcompanantes = document.getElementById("acompanantes");
const mensaje = document.getElementById("mensajeConfirmacion");
const selectAsistencia = document.getElementById("asistencia");

// ============================================
// State Management
// ============================================

let invitadoActualId = null;

// ============================================
// Utility Functions
// ============================================

/**
 * Display error message to user
 * @param {string} texto - Error message text
 */
function mostrarError(texto) {
  console.error("Error:", texto);
  
  // Clear any previous messages
  mensaje.textContent = "";
  mensaje.className = "text-danger mt-3 mb-0 text-center";
  
  // Show error in the message area
  mensaje.textContent = `❌ ${texto}`;
  mensaje.style.display = "block";
  
  // Hide error after 5 seconds
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.style.display = "none";
  }, 5000);
}

/**
 * Display success message to user
 * @param {string} texto - Success message text
 */
function mostrarExito(texto) {
  console.log("Success:", texto);
  
  mensaje.textContent = "";
  mensaje.className = "text-success mt-3 mb-0 text-center";
  mensaje.textContent = `✅ ${texto}`;
  mensaje.style.display = "block";
}

/**
 * Validate invitation code
 * @param {string} codigo - Invitation code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validarCodigo(codigo) {
  if (!codigo || typeof codigo !== 'string') {
    return false;
  }
  
  const codigoLimpio = codigo.trim();
  return codigoLimpio.length > 0;
}

/**
 * Reset form and state
 */
function resetearFormulario() {
  formConfirmacion.reset();
  invitadoInfo.classList.add("oculto");
  mensaje.textContent = "";
  mensaje.style.display = "none";
  inputCodigo.value = "";
  invitadoActualId = null;
}

/**
 * Set button loading state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cargando...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

// ============================================
// Guest Search Functionality
// ============================================

/**
 * Search for guest by invitation code
 */
async function buscarInvitado() {
  try {
    const codigo = inputCodigo.value.trim();
    
    // Validate code
    if (!validarCodigo(codigo)) {
      mostrarError("Por favor ingresa tu código de invitación.");
      inputCodigo.focus();
      return;
    }

    console.log("Searching for guest with code:", codigo);
    
    // Set button loading state
    setButtonLoading(btnBuscar, true);

    // Query Firestore for guest
    const invitadosRef = collection(db, "invitados");
    const q = query(invitadosRef, where("codigo", "==", codigo));
    const querySnapshot = await getDocs(q);

    // Check if guest was found
    if (querySnapshot.empty) {
      console.log("No guest found with that code");
      mostrarError("Código no encontrado. Verifica tu código de invitación.");
      setButtonLoading(btnBuscar, false);
      return;
    }

    // Get guest data
    const snap = querySnapshot.docs[0];
    const data = snap.data();
    invitadoActualId = snap.id;
    
    console.log("Guest found:", data, "ID:", invitadoActualId);

    // Display guest information
    mostrarInformacionInvitado(data);
    
    setButtonLoading(btnBuscar, false);
    
  } catch (error) {
    console.error("Error searching for guest:", error);
    mostrarError("Error al buscar tu código. Por favor intenta nuevamente.");
    setButtonLoading(btnBuscar, false);
  }
}

/**
 * Display guest information and show confirmation form
 * @param {Object} data - Guest data from Firestore
 */
function mostrarInformacionInvitado(data) {
  // Show guest info section
  invitadoInfo.classList.remove("oculto");
  
  // Set guest name
  nombreInvitado.textContent = `Hola, ${data.nombre}!`;
  
  // Set maximum companions allowed
  if (data.maxAcompanantes !== undefined) {
    inputAcompanantes.max = data.maxAcompanantes;
    inputAcompanantes.setAttribute('max', data.maxAcompanantes);
  }
  
  // Pre-fill form if guest already confirmed
  if (data.estado) {
    selectAsistencia.value = data.estado === "confirmado" ? "si" : "no";
    toggleAcompanantesField(data.estado === "confirmado");
  }
  
  if (data.acompanantes !== undefined) {
    inputAcompanantes.value = data.acompanantes;
  }
  
  // Clear any previous messages
  mensaje.textContent = "";
  
  // Focus on attendance select
  selectAsistencia.focus();
}

/**
 * Toggle companions field based on attendance
 * @param {boolean} show - Whether to show the field
 */
function toggleAcompanantesField(show) {
  const acompanantesGroup = inputAcompanantes.closest('.mb-3, .mb-4');
  if (acompanantesGroup) {
    acompanantesGroup.style.display = show ? 'block' : 'none';
  }
}

// ============================================
// Confirmation Submission
// ============================================

/**
 * Submit attendance confirmation
 * @param {Event} e - Form submit event
 */
async function confirmarAsistencia(e) {
  e.preventDefault();

  try {
    // Validate that guest was searched first
    if (!invitadoActualId) {
      mostrarError("Por favor busca tu código de invitación primero");
      inputCodigo.focus();
      return;
    }

    const asistencia = selectAsistencia.value;
    const acompanantes = parseInt(inputAcompanantes.value) || 0;

    // Validate companions number
    if (acompanantes < 0) {
      mostrarError("El número de acompañantes no puede ser negativo");
      inputAcompanantes.focus();
      return;
    }

    // Validate max companions
    const maxAcompanantes = parseInt(inputAcompanantes.max);
    if (!isNaN(maxAcompanantes) && acompanantes > maxAcompanantes) {
      mostrarError(`El número máximo de acompañantes es ${maxAcompanantes}`);
      inputAcompanantes.focus();
      return;
    }

    console.log("Updating guest:", invitadoActualId);
    
    // Get submit button and set loading state
    const submitButton = formConfirmacion.querySelector('button[type="submit"]');
    setButtonLoading(submitButton, true);

    // Update guest in Firestore
    const ref = doc(db, "invitados", invitadoActualId);
    await updateDoc(ref, {
      estado: asistencia === "si" ? "confirmado" : "rechazado",
      acompanantes: asistencia === "si" ? acompanantes : 0,
      fechaConfirmacion: new Date()
    });

    // Show success message
    const mensajeTexto = asistencia === "si" 
      ? "¡Gracias por confirmar tu asistencia! Nos vemos en la boda 💚"
      : "Gracias por tu respuesta. Lamentamos que no puedas asistir.";
    
    mostrarExito(mensajeTexto);
    
    setButtonLoading(submitButton, false);
    
    // Reset form after 4 seconds
    setTimeout(() => {
      resetearFormulario();
    }, 4000);
    
  } catch (error) {
    console.error("Error confirming attendance:", error);
    mostrarError("Error al confirmar la asistencia. Por favor intenta nuevamente.");
    
    const submitButton = formConfirmacion.querySelector('button[type="submit"]');
    setButtonLoading(submitButton, false);
  }
}

// ============================================
// Event Listeners
// ============================================

// Search button click
btnBuscar.addEventListener("click", buscarInvitado);

// Allow search with Enter key
inputCodigo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarInvitado();
  }
});

// Form submission
formConfirmacion.addEventListener("submit", confirmarAsistencia);

// Toggle companions field based on attendance selection
selectAsistencia.addEventListener("change", (e) => {
  const asisteSi = e.target.value === "si";
  toggleAcompanantesField(asisteSi);
  
  // Reset companions to 0 if not attending
  if (!asisteSi) {
    inputAcompanantes.value = 0;
  }
});

// Input validation for companions
inputAcompanantes.addEventListener("input", (e) => {
  const value = parseInt(e.target.value);
  const max = parseInt(e.target.max);
  
  if (value < 0) {
    e.target.value = 0;
  }
  
  if (!isNaN(max) && value > max) {
    e.target.value = max;
  }
});

// ============================================
// Page Load
// ============================================

console.log("✅ Guest confirmation system initialized");

// Auto-focus on code input when page loads
window.addEventListener('load', () => {
  if (inputCodigo) {
    inputCodigo.focus();
  }
});
