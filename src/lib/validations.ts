import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title wajib diisi")
    .max(200, "Title maksimal 200 karakter"),
  description: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  categoryId: z.string().cuid().optional().or(z.literal("")),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Due date tidak valid",
    }),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ValidationErrors<T extends z.ZodTypeAny> = Partial<
  Record<keyof z.infer<T>, string[]>
>;

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return { success: true as const, data: result.data };
}
