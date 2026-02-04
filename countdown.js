/* ============================================
   Wedding Countdown Timer
   Updates every second until the wedding date
   ============================================ */

// ============================================
// Configuration
// ============================================

// Wedding Date: May 2, 2026 at 3:30 PM
const WEDDING_DATE = "2026-05-02T15:30:00";

// ============================================
// DOM Elements
// ============================================

const countdownEl = document.getElementById("countdown");
const contadorSection = document.getElementById("contador");

// ============================================
// Countdown Timer
// ============================================

let countdownTimer = null;

/**
 * Format number with leading zeros
 * @param {number} n - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

/**
 * Get target date from HTML or use fallback
 * @returns {Date} - Target wedding date
 */
function getTargetDate() {
  const targetIso = contadorSection?.dataset?.date || WEDDING_DATE;
  return new Date(targetIso);
}

/**
 * Update countdown display
 */
function updateCountdown() {
  const targetDate = getTargetDate();
  const now = new Date();
  const timeRemaining = targetDate - now;

  // Check if wedding date has passed
  if (timeRemaining <= 0) {
    // Set all values to 00
    document.getElementById('countdown-days').textContent = "00";
    document.getElementById('countdown-hours').textContent = "00";
    document.getElementById('countdown-minutes').textContent = "00";
    document.getElementById('countdown-seconds').textContent = "00";
    
    // Stop the timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    
    console.log("✅ ¡El gran día ya llegó!");
    return;
  }

  // Calculate time units
  const totalSeconds = Math.floor(timeRemaining / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  // Update DOM elements
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (daysEl) daysEl.textContent = formatNumber(days);
  if (hoursEl) hoursEl.textContent = formatNumber(hours);
  if (minutesEl) minutesEl.textContent = formatNumber(minutes);
  if (secondsEl) secondsEl.textContent = formatNumber(seconds);
}

/**
 * Initialize countdown timer
 */
function initCountdown() {
  // Validate countdown element exists
  if (!countdownEl) {
    console.warn("⚠️ Countdown element not found. Check your HTML.");
    return;
  }

  // Validate target date
  const targetDate = getTargetDate();
  if (isNaN(targetDate.getTime())) {
    if (countdownEl) {
      countdownEl.textContent = "Fecha de boda no configurada";
    }
    console.error("❌ Invalid target date:", contadorSection?.dataset?.date || WEDDING_DATE);
    return;
  }

  // Run first update immediately
  updateCountdown();
  
  // Update every second
  countdownTimer = setInterval(updateCountdown, 1000);
  
  console.log("🕐 Countdown initialized for:", targetDate.toLocaleString('es-MX'));
}

// ============================================
// Page Load
// ============================================

// Initialize countdown when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdown);
} else {
  initCountdown();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
