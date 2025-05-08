import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import type { Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all" })),
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const resultPatch = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (data) => {
            const todolistIndex = data.findIndex((el) => el.id === id)
            if (todolistIndex !== -1) {
              data.splice(todolistIndex, 1)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          resultPatch.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      onQueryStarted: async ({ id, title }, { queryFulfilled, dispatch }) => {
        const resultPatch = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (data) => {
            const currentTodolist = data.find((td) => td.id === id)
            if (currentTodolist) currentTodolist.title = title
          }),
        )

        try {
          await queryFulfilled
        } catch {
          resultPatch.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi
