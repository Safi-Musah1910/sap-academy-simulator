"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeCompanyPayload(formData: FormData) {
  return {
    code: readString(formData, "code").toUpperCase(),
    name: readString(formData, "name"),
    country: readString(formData, "country").toUpperCase(),
    currency: readString(formData, "currency").toUpperCase(),
    city: readString(formData, "city"),
    status: readString(formData, "status") || "Active",
    fiscalYearVariantId: readString(formData, "fiscalYearVariantId") || null,
  };
}

function validateCompany(data: ReturnType<typeof normalizeCompanyPayload>) {
  if (!/^[A-Z0-9]{4}$/.test(data.code)) {
    throw new Error("Company code must be four letters or numbers.");
  }

  if (!data.name || !data.city || !data.country || !data.currency) {
    throw new Error("Company code, name, city, country, and currency are required.");
  }

  if (!/^[A-Z]{2}$/.test(data.country)) {
    throw new Error("Country must use a two-letter ISO code.");
  }

  if (!/^[A-Z]{3}$/.test(data.currency)) {
    throw new Error("Currency must use a three-letter ISO code.");
  }
}

export async function createCompany(formData: FormData) {
  const data = normalizeCompanyPayload(formData);
  validateCompany(data);

  await prisma.company.create({ data });
  revalidatePath("/");
  revalidatePath("/company-code");
}

export async function updateCompany(formData: FormData) {
  const id = readString(formData, "id");
  const data = normalizeCompanyPayload(formData);
  validateCompany(data);

  await prisma.company.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/company-code");
}

export async function deleteCompany(formData: FormData) {
  const id = readString(formData, "id");

  await prisma.company.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/company-code");
}
