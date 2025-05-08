import type { UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}

export type UpdateTaskType = { todolistId: string; taskId: string; model: UpdateTaskModel }

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
