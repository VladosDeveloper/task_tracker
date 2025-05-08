import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx"
import {  useState } from "react"
import { PAGE_SIZE } from "@/common/constants"
import { Bouncy } from "ldrs/react"
import "ldrs/react/Bouncy.css"
import styles from './Tasks.module.css'
import { useAppSelector } from "@/common/hooks"
import { selectThemeMode } from "@/app/app-slice.ts"

type Props = {
  todolist: DomainTodolist
}

export type QueryParamsType = {
  count: number
  page: number
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const [queryParams, setQueryParams] = useState<QueryParamsType>({ count: 5, page: 1 })
  
  const theme = useAppSelector(selectThemeMode)
  const loaderTheme = theme === 'dark' ? 'white' : 'black'
  
  
  const { data, isLoading, isFetching } = useGetTasksQuery({ todolistId: id, params: queryParams })

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }
  


  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          {isFetching
            ? (<div className={styles.loader}><Bouncy size="45" speed="1.75" color={loaderTheme} /></div>)
            :( <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}</List>)
          }
         
          {data && Math.ceil(data.totalCount / PAGE_SIZE) > 1 && (
            <TasksPagination  totalCount={data?.totalCount || 0} page={queryParams.page} setPage={setQueryParams} />
          )}
        </>
      )}
    </>
  )
}
