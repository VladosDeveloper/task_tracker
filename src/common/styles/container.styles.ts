import { SxProps } from "@mui/material"

export const containerSx = (isMobileScreen: boolean): SxProps => ({
  display: "flex",
  justifyContent: isMobileScreen ? "space-between" : 'flex-start',
  alignItems: isMobileScreen ? "center" : 'flex-start',
  flexDirection: isMobileScreen ? "row" : "column",
})
