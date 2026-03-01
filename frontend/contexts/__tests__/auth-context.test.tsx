import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-context";
import api from "@/lib/api";
import Cookies from "js-cookie";

jest.mock("@/lib/api");
jest.mock("js-cookie");

const mockApi = api as jest.Mocked<typeof api>;
const mockCookies = Cookies as jest.Mocked<typeof Cookies>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockCookies.get as jest.Mock).mockReturnValue(undefined);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe("initialization", () => {
    it("should start with no user after loading completes", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it("should load user if token exists", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };

      (mockCookies.get as jest.Mock).mockReturnValue("mock-token");
      mockApi.get.mockResolvedValue({ data: mockUser });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(mockApi.get).toHaveBeenCalledWith("/users/me");
    });

    it("should handle loadUser error gracefully", async () => {
      (mockCookies.get as jest.Mock).mockReturnValue("invalid-token");
      mockApi.get.mockRejectedValue({ response: { status: 401 } });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(mockCookies.remove).toHaveBeenCalledWith("accessToken");
    });
  });

  describe("register", () => {
    it("should register user successfully", async () => {
      const mockResponse = {
        data: {
          user: { id: "1", email: "new@example.com" },
          tokens: { accessToken: "access-token" },
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          email: "new@example.com",
          password: "password123",
          name: "New User",
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/register", {
        email: "new@example.com",
        password: "password123",
        name: "New User",
      });
    });

    it("should throw error on registration failure", async () => {
      const mockError = {
        response: { data: { message: "Email already exists" } },
      };

      mockApi.post.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register({
            email: "existing@example.com",
            password: "password123",
          });
        }),
      ).rejects.toEqual(mockError);
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockResponse = {
        data: {
          user: { id: "1", email: "test@example.com" },
          tokens: { accessToken: "access-token" },
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
      expect(mockCookies.set).toHaveBeenCalledWith(
        "accessToken",
        "access-token",
      );
      expect(result.current.user).toEqual(mockResponse.data.user);
    });

    it("should throw error on login failure", async () => {
      const mockError = {
        response: { data: { message: "Invalid credentials" } },
      };

      mockApi.post.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        result.current.login({
          email: "wrong@example.com",
          password: "wrongpass",
        }),
      ).rejects.toBeTruthy();
    });
  });

  describe("logout", () => {
    it("should logout user successfully", async () => {
      mockApi.post.mockResolvedValue({});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/logout");
      expect(mockCookies.remove).toHaveBeenCalledWith("accessToken");
      expect(result.current.user).toBeNull();
    });

    it("should clear cookies even if API call fails", async () => {
      mockApi.post.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockCookies.remove).toHaveBeenCalledWith("accessToken");
      expect(result.current.user).toBeNull();
    });
  });
});
