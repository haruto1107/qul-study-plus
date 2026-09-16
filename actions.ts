"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function reserveSlot(slotId: string) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { data: slot } = await supabase
    .from("reservation_slots")
    .select("*")
    .eq("id", slotId)
    .single();
  if (!slot) throw new Error("予約枠が見つかりません");

  const { count } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("slot_id", slotId)
    .eq("status", "confirmed");

  if ((count ?? 0) >= slot.capacity) {
    throw new Error("この枠は定員に達しています");
  }

  const { error } = await supabase
    .from("reservations")
    .insert({ slot_id: slotId, student_id: user.id });

  // 二重予約防止 (unique制約) にかかった場合はそのままエラーを返す
  if (error) throw new Error(error.message);

  revalidatePath("/reservations");
}
