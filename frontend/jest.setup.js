import "@testing-library/jest-dom";

// Mock do next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "";
  },
}));

// Mock do js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));
