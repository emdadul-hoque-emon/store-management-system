"use server";

import { serverFetch } from "./serverFetch";
import { getCookie } from "./cookies";
import { verifyToken } from "./jwtHandlers";
import { IResponse } from "@/types/response";
import { IUser } from "@/types/user";

export const auth = async () => {
  try {
    const res = await serverFetch.get("/v1/auth/me", {
      next: { tags: ["me"] },
      credentials: "include",
    });
    const data: IResponse<IUser> = await res.json();

    console.log(data);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const session = async () => {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) return null;
    const decode = verifyToken(accessToken, process.env.JWT_SECRET!);
    if (!decode) return null;
    return (await decode).payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
