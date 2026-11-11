import { createServerFn } from "@tanstack/react-start";

export interface LoginInput {
  email: string;
  password: string;
}

export const loginAction = createServerFn({ method: "POST", strict: false })
  .validator((input: LoginInput) => input)
  .handler(
    async ({
      data,
    }): Promise<{
      ok: boolean;
      error?: string;
      user?: { id: string; email: string; name: string };
    }> => {
      const { loginWithPassword } = await import("./actions");
      const email = typeof data?.email === "string" ? data.email : "";
      const password = typeof data?.password === "string" ? data.password : "";
      return loginWithPassword(email, password);
    },
  );

export const logoutAction = createServerFn({ method: "POST", strict: false }).handler(
  async (): Promise<{ ok: boolean }> => {
    const { logout } = await import("./actions");
    return logout();
  },
);

export const logoutAllAction = createServerFn({ method: "POST", strict: false }).handler(
  async (): Promise<{ ok: boolean }> => {
    const { logoutEverywhere } = await import("./actions");
    return logoutEverywhere();
  },
);

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const changePasswordAction = createServerFn({ method: "POST", strict: false })
  .validator((input: ChangePasswordInput) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string; revokedSessions?: number }> => {
    const { changePassword } = await import("./actions");
    return changePassword({
      currentPassword: data?.currentPassword,
      newPassword: data?.newPassword,
    });
  });

export const meAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    user: { id: string; email: string; name: string } | null;
    permissions: string[];
    roles: { key: string; name: string; scope: Record<string, string | undefined> }[];
  }> => {
    const { getCurrentActor } = await import("./actions");
    const session = await getCurrentActor();
    return {
      user: session ? { ...session.user } : null,
      permissions: session?.permissions ?? [],
      roles: session?.roles ?? [],
    };
  },
);
