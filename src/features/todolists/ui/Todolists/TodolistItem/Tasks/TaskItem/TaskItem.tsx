import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useRemoveTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { createTaskModel } from "@/features/todolists/lib/utils"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import ClearIcon from "@mui/icons-material/Clear"
import styles from "./TaskItem.module.css"
import { QueryParamsType } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.tsx"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  totalPageCount: number
  setPage: (args: QueryParamsType) => void
  itemsOnPage: number
}

export const TaskItem = ({ task, todolist, setPage, totalPageCount, itemsOnPage }: Props) => {
  const [removeTask, { isLoading: isLoadingRemove }] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  
  
  const deleteTask = () => {
    removeTask({ todolistId: todolist.id, taskId: task.id })
      .unwrap()
      .then(() => {
        if (itemsOnPage === 1 && totalPageCount > 1) {
          setPage({ count: 5, page: totalPageCount - 1 })
        }
      })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)} className={styles.currentTask}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={isLoadingRemove} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={isLoadingRemove} />
      </div>
      <IconButton onClick={deleteTask} disabled={isLoadingRemove} title="Delete task">
        <ClearIcon />
      </IconButton>
    </ListItem>
  )
}
