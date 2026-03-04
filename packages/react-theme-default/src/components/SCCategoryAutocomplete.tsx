import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoryAutocomplete-contrast-color': {
        color:
          getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5)
      }
    })
  }
};

export default Component;
