"use server";

import { revalidatePath } from "next/cache";
import {
  addMasterGuest,
  addMasterGuestsBulk,
  deleteMasterGuest,
  clearAllMasterGuests,
} from "@/lib/dal/guest-list";
import { deleteRsvp } from "@/lib/dal/rsvp";

export async function addGuestAction(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  if (name.trim()) {
    await addMasterGuest(name);
    revalidatePath("/admin");
  }
}

export async function bulkAddGuestsAction(formData: FormData) {
  const rawList = formData.get("rawList")?.toString() ?? "";
  if (rawList.trim()) {
    await addMasterGuestsBulk(rawList);
    revalidatePath("/admin");
  }
}

export async function deleteGuestAction(formData: FormData) {
  const id = formData.get("id")?.toString() ?? "";
  const rsvpId = formData.get("rsvpId")?.toString() ?? "";

  if (id) {
    await deleteMasterGuest(id);
  }
  if (rsvpId) {
    await deleteRsvp(rsvpId);
  }

  revalidatePath("/admin");
}

export async function clearAllGuestsAction() {
  await clearAllMasterGuests();
  revalidatePath("/admin");
}

