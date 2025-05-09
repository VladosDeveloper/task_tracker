import {
  changeThemeModeAC,
  selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedInAC,
} from "@/app/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Toolbar from "@mui/material/Toolbar"
import { useMediaQuery } from "react-haiku"
import { ResponsiveNavigation } from "@/common/components/Header/ResponsiveNavigation.tsx"
import { useLogoutMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"
import { baseApi } from "@/app/baseApi.ts"
import { NavButton } from "@/common/components"
import Switch from "@mui/material/Switch"

export const Header = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const themeMode = useAppSelector(selectThemeMode)
  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
          localStorage.removeItem(AUTH_TOKEN)
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  const status = useAppSelector(selectAppStatus)
  const breakPoint = useMediaQuery("(max-width: 768px)", false)


  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          {!breakPoint ? (
            <div>
              {isLoggedIn && <NavButton onClick={logoutHandler}>Sign out</NavButton>}
              <Switch color={"default"} onChange={changeMode} />
            </div>
          ) : (
            <ResponsiveNavigation />
          )}
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
