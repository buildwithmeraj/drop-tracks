"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createAirdropForUser,
  deleteAirdropForUser,
  updateAirdropForUser,
} from "@/lib/airdrops";
import { extractAirdropDetailsWithGemini } from "@/lib/gemini";
import {
  deriveNameFromTelegramPost,
  fetchTelegramPostText,
  parseTelegramMessageLink,
} from "@/lib/telegram";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return session.user.id;
}

function revalidateAirdropPages(id) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/airdrops");
  revalidatePath("/dashboard/airdpops");
  revalidatePath("/dashboard/airdrops/add");

  if (id) {
    revalidatePath(`/dashboard/airdrops/update/${id}`);
    revalidatePath(`/dashboard/airdpops/update/${id}`);
  }
}

export async function createAirdropAction(formData) {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const result = await createAirdropForUser(userId, formData);
  if (result.ok) {
    revalidateAirdropPages();
  }

  return result;
}

export async function updateAirdropAction(id, formData) {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const result = await updateAirdropForUser(userId, id, formData);
  if (result.ok) {
    revalidateAirdropPages(id);
  }

  return result;
}

export async function deleteAirdropAction(id) {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const result = await deleteAirdropForUser(userId, id);
  if (result.ok) {
    revalidateAirdropPages(id);
  }

  return result;
}

export async function analyzeTelegramAirdropAction(link) {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const parsed = parseTelegramMessageLink(link);
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  try {
    const telegramPost = await fetchTelegramPostText(link);
    const extracted = await extractAirdropDetailsWithGemini({
      link: telegramPost.canonicalUrl,
      postText: telegramPost.postText,
    });

    const data = {
      ...extracted,
      name: extracted.name || deriveNameFromTelegramPost(telegramPost.postText),
    };

    const filledCount = Object.values(data).filter(
      (value) => value !== null && value !== undefined && value !== "",
    ).length;

    return {
      ok: true,
      message:
        filledCount > 0
          ? `Telegram post analyzed. ${filledCount} field${filledCount === 1 ? "" : "s"} found.`
          : "Telegram post analyzed, but no clear fields were found to autofill.",
      data,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Telegram autofill failed. Please try again.",
    };
  }
}
