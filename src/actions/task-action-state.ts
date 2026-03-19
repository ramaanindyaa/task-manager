import type { TaskInput } from "@/lib/validations";

type TaskActionErrors = Partial<Record<keyof TaskInput | "_form", string[]>>;

export type TaskActionState = {
  success: boolean;
  errors: TaskActionErrors | null;
};

export const initialTaskActionState: TaskActionState = {
  success: false,
  errors: null,
};
