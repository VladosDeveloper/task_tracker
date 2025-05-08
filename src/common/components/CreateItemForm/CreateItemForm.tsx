import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"

type Props = {
  onCreateItem: (title: string) => void
  disabled?: boolean
  placeHolderText?: string
}

export const CreateItemForm = ({ onCreateItem, disabled,placeHolderText }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const createItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
      setTitle("")
    } else {
      setError("Title is required")
    }
  }

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
    setError(null)
  }

  const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createItemHandler()
    }
  }

  return (
    <div>
      <TextField
        label={placeHolderText ? placeHolderText : "Enter a title"}
        variant={"outlined"}
        value={title}
        size={"small"}
        error={!!error}
        helperText={error}
        onChange={changeTitleHandler}
        onKeyDown={createItemOnEnterHandler}
        disabled={disabled}
      />
      <IconButton onClick={createItemHandler} color={"primary"} size={'medium'} disabled={disabled}>
        <AddBoxIcon />
      </IconButton>
    </div>
  )
}
