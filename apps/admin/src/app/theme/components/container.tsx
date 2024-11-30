import { Theme } from "@mui/material";

export default function Container(theme: Theme) {
    return {
      MuiContainer: {
        defaultProps: {
          maxWidth: false,
        },
        styleOverrides: {
          root: ({ theme }) => ({
  
          })
        }
      },
    };
  }