/**
 * Escapes HTML characters to prevent XSS attacks
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitizes content for safe HTML display
 */
export function sanitizeContent(content) {
  return escapeHtml(content);
}