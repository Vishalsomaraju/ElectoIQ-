// src/utils/helpers.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import DOMPurify from 'dompurify'

/**
 * Merge Tailwind classes safely.
 * @param {...any} inputs - Tailwind class strings or conditionals
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitize user input before sending to external APIs or database.
 * Strips HTML tags, template injections, JS protocol, trims, and caps length.
 * @param {string} raw - Raw user input string
 * @returns {string} Sanitized, safe string
 */
export function sanitizeInput(raw) {
  if (!raw) return ''
  return raw
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // strip script blocks + content
    .replace(/<style[^>]*>.*?<\/style>/gis, '')   // strip style blocks + content
    .replace(/<[^>]*>/g, '')                       // strip remaining HTML tags
    .replace(/\{[^}]*\}/g, '')                    // strip template injections
    .replace(/javascript:/gi, '')                  // strip JS protocol
    .trim()
    .slice(0, 500)                                 // hard length cap
}

/**
 * Format a date string to Indian locale.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/**
 * Capitalize first letter of a string.
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Calculate quiz score as percentage.
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Rounded percentage score
 */
export function calcScore(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Get grade label based on score percentage.
 * @param {number} score - Score percentage (0-100)
 * @returns {{ label: string, color: string, emoji: string }} Grade object
 */
export function getGrade(score) {
  if (score >= 90) return { label: 'Expert Voter', color: 'text-green-400', emoji: '🏆' }
  if (score >= 70) return { label: 'Informed Voter', color: 'text-blue-400', emoji: '🎓' }
  if (score >= 50) return { label: 'Aware Citizen', color: 'text-yellow-400', emoji: '📚' }
  return { label: 'Keep Learning', color: 'text-red-400', emoji: '💪' }
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 * @param {Array} array - Input array
 * @returns {Array} New shuffled array
 */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Truncate text to a max length with ellipsis.
 * @param {string} text - Input text
 * @param {number} [maxLen=120] - Maximum character length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLen = 120) {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

/**
 * Debounce a function call.
 * @param {Function} fn - Function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
