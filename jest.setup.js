import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock crypto.randomUUID
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}
global.crypto.randomUUID = () => {
  return 'test-uuid-' + Math.random().toString(36).substr(2, 9);
};
