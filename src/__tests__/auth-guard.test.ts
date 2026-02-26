import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the auth module
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

// Import after mocking
const { requireAdmin, requireAuth, requireOwner } = await import("@/lib/auth-guard");

describe("Auth Guard", () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  describe("requireAdmin", () => {
    it("rejects unauthenticated users", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await requireAdmin();
      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.error).toContain("লগইন");
      }
    });

    it("rejects users without id", async () => {
      mockAuth.mockResolvedValue({ user: { name: "test" } });
      const result = await requireAdmin();
      expect(result.authorized).toBe(false);
    });

    it("rejects STUDENT role", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1", role: "STUDENT" } });
      const result = await requireAdmin();
      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.error).toContain("অ্যাডমিন");
      }
    });

    it("accepts ADMIN role", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1", role: "ADMIN" } });
      const result = await requireAdmin();
      expect(result.authorized).toBe(true);
      if (result.authorized) {
        expect(result.session.user.id).toBe("u1");
      }
    });

    it("accepts SUPER_ADMIN role", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1", role: "SUPER_ADMIN" } });
      const result = await requireAdmin();
      expect(result.authorized).toBe(true);
    });

    it("rejects INSTRUCTOR role", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1", role: "INSTRUCTOR" } });
      const result = await requireAdmin();
      expect(result.authorized).toBe(false);
    });
  });

  describe("requireAuth", () => {
    it("rejects unauthenticated users", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await requireAuth();
      expect(result.authorized).toBe(false);
    });

    it("accepts any authenticated user with id", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1", role: "STUDENT" } });
      const result = await requireAuth();
      expect(result.authorized).toBe(true);
    });
  });

  describe("requireOwner", () => {
    it("rejects unauthenticated users", async () => {
      mockAuth.mockResolvedValue(null);
      const result = await requireOwner("u1");
      expect(result.authorized).toBe(false);
    });

    it("rejects non-owner", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1" } });
      const result = await requireOwner("u2");
      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.error).toContain("অ্যাক্সেস নেই");
      }
    });

    it("accepts owner", async () => {
      mockAuth.mockResolvedValue({ user: { id: "u1" } });
      const result = await requireOwner("u1");
      expect(result.authorized).toBe(true);
    });
  });
});
