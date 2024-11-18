import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

// const MuiAppBar: Components<Theme>['MuiAppBar'] = {
//   /** **************************************
//    * DEFAULT PROPS
//    *************************************** */
//   defaultProps: { color: 'transparent' },

//   /** **************************************
//    * STYLE
//    *************************************** */
//   styleOverrides: { root: { boxShadow: 'none' } },
// };

// // ----------------------------------------------------------------------

// export const appBar = { MuiAppBar };
export default function appBar(theme: Theme) {
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