"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lesson, LessonMaterial } from "@/lib/supabase/types";

// 授業ルームの資料配信・授業状態をSupabase Realtimeで購読する。
// ページリロードなしに、先生の操作(資料配信・授業終了)を反映する。
export function useLessonRealtime(
  lessonId: string,
  initialLesson: Lesson,
  initialMaterials: LessonMaterial[]
) {
  const [lesson, setLesson] = useState(initialLesson);
  const [materials, setMaterials] = useState(initialMaterials);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`lesson-room-${lessonId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "lessons", filter: `id=eq.${lessonId}` },
        (payload) => setLesson((prev) => ({ ...prev, ...(payload.new as Lesson) }))
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "lesson_materials", filter: `lesson_id=eq.${lessonId}` },
        async (payload) => {
          const { data } = await supabase
            .from("materials")
            .select("*")
            .eq("id", (payload.new as any).material_id)
            .single();
          setMaterials((prev) => [
            { ...(payload.new as LessonMaterial), material: data ?? undefined },
            ...prev
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonId]);

  return { lesson, materials };
}
