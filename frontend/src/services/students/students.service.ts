"use server";

import { BLOOD_TYPES, GENDERS } from "@/services/students/students.constants";
import { zodValidator } from "@/lib/zod-validator";
import z from "zod";

const userSchema = z.object({
  firstName: z
    .string("First name is required")
    .min(1, "First name is required"),
  lastName: z.string("Last name is required").min(1, "Last name is required"),
  email: z.string("Email is required").email("Invalid email address"),
  phone: z
    .string("Phone number is required")
    .min(1, "Phone number is required"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  gender: z.enum(GENDERS).optional(),
  bloodType: z.enum(BLOOD_TYPES).optional(),
  dateOfBirth: z
    .string("Date of birth is required")
    .min(1, "Date of birth is required"),
  address: z.string().optional(),
  nationalId: z.string().optional(),
});

const studentSchema = z.object({
  roll: z.string("Roll is required").min(1, "Roll is required"),
  admissionDate: z
    .string("Admission date is required")
    .min(1, "Admission date is required"),
  graduationDate: z.string().optional(),
  guardianName: z
    .string("Guardian name is required")
    .min(1, "Guardian name is required"),
  guardianPhone: z
    .string("Guardian phone is required")
    .min(1, "Guardian phone is required"),
  department: z
    .string("Department is required")
    .min(1, "Department is required"),
  batch: z.string("Batch is required").min(1, "Batch is required"),
  section: z.string().optional(),
});

export const createStudent = async (prevState: unknown, formData: FormData) => {
  console.log(formData);
  const userInfo = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    gender: formData.get("gender"),
    bloodType: formData.get("bloodType"),
    dateOfBirth: formData.get("dateOfBirth"),
    address: formData.get("address"),
    nationalId: formData.get("nationalId"),
  };
  const studentInfo = {
    roll: formData.get("roll"),
    admissionDate: formData.get("admissionDate"),
    graduationDate: formData.get("graduationDate"),
    guardianName: formData.get("guardianName"),
    guardianPhone: formData.get("guardianPhone"),
    department: formData.get("department"),
    batch: formData.get("batch"),
    section: formData.get("section"),
  };
  try {
    const validatedPayload = zodValidator(userInfo, userSchema);
    console.log(validatedPayload);
    if (!validatedPayload.success) {
      return {
        success: false,
        errors: validatedPayload.errors,
        formData: { userInfo, studentInfo },
        message: "validation error",
      };
    }
    const validatedStudent = zodValidator(studentInfo, studentSchema);
    if (!validatedStudent.success) {
      return {
        success: false,
        errors: validatedStudent.errors,
        formData: { userInfo, studentInfo },
        message: "validation error",
      };
    }

    console.log(validatedStudent);
    return {
      success: true,
      formData: { userInfo, studentInfo },
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      errors: [{ message: error?.message }],
      formData: { userInfo, studentInfo },
      message: "validation error",
    };
  }
};
