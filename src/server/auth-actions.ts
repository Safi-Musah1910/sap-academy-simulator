"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  isValidDemoLogin,
} from "@/lib/auth";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function login(formData: FormData) {
  const username = readString(formData, "username");
  const password = readString(formData, "password");
  const redirectTo = readString(formData, "redirectTo") || "/";

  if (!isValidDemoLogin(username, password)) {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
