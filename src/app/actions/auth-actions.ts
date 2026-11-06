"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  timingSafePasswordCheck,
  setSuperadminSession,
  clearSuperadminSession,
} from "@/lib/auth";

export interface AuthState {
  error?: string;
}

export async function loginSuperadminAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") || "").trim();

  if (!password) {
    return { error: "Por favor ingresá la contraseña de Superadmin." };
  }

  const isValid = timingSafePasswordCheck(password);
  if (!isValid) {
    return { error: "Contraseña incorrecta. Verificá los datos e intentá de nuevo." };
  }

  await setSuperadminSession();
  revalidatePath("/superadmin");
  redirect("/superadmin");
}

export async function logoutSuperadminAction(): Promise<void> {
  await clearSuperadminSession();
  revalidatePath("/superadmin");
  redirect("/superadmin");
}

