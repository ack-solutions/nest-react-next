import { Theme } from "@mui/material";

export default function Container(theme: Theme) {
    return {
        MuiContainer: {

            styleOverrides: {
                root: ({ theme }) => ({

                })
            }
        },
    };
}
