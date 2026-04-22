// src/utils/helpers.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Format a date string to Indian locale */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/** Capitalize first letter of a string */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Calculate quiz score as percentage */
export function calcScore(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

/** Get grade label based on score percentage */
export function getGrade(score) {
  if (score >= 90) return { label: 'Expert Voter', color: 'text-green-400', emoji: '🏆' }
  if (score >= 70) return { label: 'Informed Voter', color: 'text-blue-400', emoji: '🎓' }
  if (score >= 50) return { label: 'Aware Citizen', color: 'text-yellow-400', emoji: '📚' }
  return { label: 'Keep Learning', color: 'text-red-400', emoji: '💪' }
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Truncate text to a max length */
export function truncate(text, maxLen = 120) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

/** Debounce a function */
export function debounce(fn, delay = 300) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
