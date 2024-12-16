export default function appBar() {
    return {
        MuiAppBar: {
            defaultProps: {
                color: 'transparent'
            },
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            },
        }
    }
}
