import Pagination from "@mui/material/Pagination"
import { ChangeEvent } from "react"
import styles from "./TasksPagination.module.css"
import { QueryParamsType } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.tsx"

type Props = {
  totalCount: number
  page: number
  setPage: (args: QueryParamsType) => void
}

export const TasksPagination = ({ totalCount, page, setPage }: Props) => {
  const changePage = (_: ChangeEvent<unknown>, page: number) => {
    setPage({ page, count: 5 })
  }

  return (
    <Pagination
      count={Math.ceil(totalCount / 5)}
      page={page}
      onChange={changePage}
      shape="rounded"
      className={styles.pagination}
    />
  )
}