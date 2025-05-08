import { baseApi } from "@/app/baseApi"
import { BaseResponse, UpdateTaskType } from "@/common/types"
import type { DomainTask, GetTasksResponse } from "./tasksApi.types"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { count: number; page: number } }>({
      query: ({ todolistId, params }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        params,
      }),
      providesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    updateTask: build.mutation<BaseResponse<{ item: DomainTask }>, UpdateTaskType>({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      onQueryStarted: async ({ todolistId, taskId, model }, { queryFulfilled, dispatch, getState }) => {
        const cachedArgs = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        const patchResults: any[] = []

        cachedArgs.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData(
                "getTasks",
                { todolistId: todolistId, params: { count: 5, page: params.page } },
                (data) => {
                  const index = data.items.findIndex((t) => t.id === taskId)
                  if (index !== -1) {
                    data.items[index] = { ...data.items[index], ...model }
                  }
                },
              ),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((result) => {
            result.undo()
          })
        }
      },
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi
