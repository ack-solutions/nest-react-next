export default function appBar(_theme) {
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
