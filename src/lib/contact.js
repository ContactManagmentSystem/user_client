/**
 * Redirects to a given contact link.
 * Supports URLs (https), emails (mailto), and phone numbers (tel).
 *
 * @param {string} link - The destination link (e.g., "https://...", "mailto:...", "tel:...")
 */
export function redirectToContact(link) {
  if (!link || typeof link !== "string") return;

  // Normalize link (add protocols if missing)
  if (link.startsWith("http://") || link.startsWith("https://")) {
    window.open(link, "_blank", "noopener noreferrer");
  } else if (link.startsWith("mailto:")) {
    window.location.href = link;
  } else if (link.startsWith("tel:")) {
    window.location.href = link;
  } else if (link.includes("@")) {
    // Auto-prefix email if just "user@example.com"
    window.location.href = `mailto:${link}`;
  } else if (/^\+?[0-9]{7,}$/.test(link)) {
    // Auto-prefix phone number if it's a valid number
    window.location.href = `tel:${link}`;
  } else {
    console.warn("Unknown contact link format:", link);
  }
}
