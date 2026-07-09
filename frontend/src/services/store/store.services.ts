"use server";
import { setCookie } from "@/lib/cookies";
import { serverFetch } from "@/lib/serverFetch";
import { zodValidator } from "@/lib/zod-validator";
import z from "zod";
import cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";

const createStoreSchema = z
  .object({
    // Store
    store_name: z.string().trim().min(1, "Store name is required"),

    store_email: z.string().trim().email("Invalid store email"),

    store_phone: z.string().trim().min(1, "Store phone is required"),

    store_address: z.string().trim().min(1, "Store address is required"),

    // Checkbox
    use_store_info: z.boolean(),

    // Admin
    name: z.string().trim().optional(),

    email: z
      .string()
      .trim()
      .email("Invalid admin email")
      .optional()
      .or(z.literal("")),

    phone: z.string().trim().optional(),

    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log(data.use_store_info, "store info");
    // If using store info, no validation for admin fields
    if (data.use_store_info) return;

    if (!data.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "First name is required",
      });
    }

    if (!data.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Admin email is required",
      });
    }

    if (!data.password?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required",
      });
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 6 characters",
      });
    }
  });

export const createStore = async (
  initialState: unknown,
  formData: FormData,
) => {
  let payload = {
    store_name: formData.get("store_name")?.toString(),
    store_email: formData.get("store_email")?.toString(),
    store_phone: formData.get("store_phone")?.toString(),
    store_address: formData.get("store_address")?.toString(),
    use_store_info: formData.get("use_store_info")?.toString() === "on",
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    phone: formData.get("phone")?.toString(),
    password: formData.get("password")?.toString(),
  };

  console.log(payload);

  payload = payload.use_store_info
    ? {
        ...payload,
        name: payload.store_name,
        email: payload.store_email,
        phone: payload.store_phone,
        password: "admin", // default password
      }
    : payload;
  try {
    const validatedPayload = zodValidator(payload, createStoreSchema);
    if (!validatedPayload.success) {
      console.log(validatedPayload);
      return {
        success: false,
        errors: validatedPayload.errors,
        formData: payload,
        message: "validation error",
      };
    }

    const res = await serverFetch.post("/v1/store", {
      body: JSON.stringify(validatedPayload.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data);
    if (!data?.success) throw new Error(data?.message);

    const cookiesHeaders = res.headers.getSetCookie();
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    if (cookiesHeaders && cookiesHeaders.length > 0) {
      cookiesHeaders.forEach((c) => {
        const parsed = cookie.parse(c);
        if (parsed["accessToken"]) {
          accessTokenObject = parsed;
        }
        if (parsed["refreshToken"]) {
          refreshTokenObject = parsed;
        }
      });

      if (!accessTokenObject) {
        throw new Error("No access token found");
      }
      if (!refreshTokenObject) {
        throw new Error("No refresh token found");
      }

      await setCookie("accessToken", accessTokenObject.accessToken, {
        httpOnly: true,
        sameSite: accessTokenObject.SameSite || "none",
        maxAge: parseInt(accessTokenObject["Max-Age"]),
        path: accessTokenObject.path,
        secure: true,
      });
      await setCookie("refreshToken", refreshTokenObject.refreshToken, {
        httpOnly: true,
        sameSite: refreshTokenObject.SameSite || "none",
        maxAge: parseInt(refreshTokenObject["Max-Age"]),
        path: refreshTokenObject.path,
        secure: true,
      });
    } else {
      throw new Error("No get set cookie found");
    }

    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject["accessToken"],
      process.env.JWT_SECRET as string,
    );
    if (typeof verifiedToken === "string") {
      throw new Error("Failed to verify token");
    }

    redirect("/invoices");
  } catch (error: any) {
    console.log(error);
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      errors: error?.issues,
      formData: payload,
      message: error?.message,
    };
  }
};
