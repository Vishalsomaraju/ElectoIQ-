export const logger = {
  log: (...args) => {
    if (!import.meta.env.PROD) console.log(...args)
  },
  warn: (...args) => {
    if (!import.meta.env.PROD) console.warn(...args)
  },
  error: (...args) => {
    if (!import.meta.env.PROD) console.error(...args)
  },
}
