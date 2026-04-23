import '@testing-library/jest-dom'

// Silence known noisy warnings in JSDOM
const originalError = console.error.bind(console)
beforeAll(() => {
  console.error = (msg, ...args) => {
    if (typeof msg === 'string' && (
      msg.includes('framer-motion') ||
      msg.includes('ResizeObserver') ||
      msg.includes('matchMedia')
    )) return
    originalError(msg, ...args)
  }
})
afterAll(() => { console.error = originalError })

// Mock browser APIs that JSDOM doesn't have
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})
