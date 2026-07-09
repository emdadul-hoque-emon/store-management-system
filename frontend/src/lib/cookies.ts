"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  } catch (error) {
    throw error;
  }
};

export const setCookie = async (
  key: string,
  value: string,
  options: Partial<ResponseCookie>
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
};

export const deleteCookie = async (name: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    throw error;
  }
};
