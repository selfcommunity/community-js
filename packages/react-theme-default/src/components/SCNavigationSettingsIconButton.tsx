import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    menuRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-paper': {
        maxWidth: 400,
        padding: theme.spacing(2),
        '& .MuiList-root': {
          padding: 0
        }
      },
      '& .SCNavigationSettingsIconButton-item': {
        color:
          getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5
            ? lighten(theme.palette.common.white, 0.5)
            : darken(theme.palette.common.white, 0.5),
        '& .MuiListItemIcon-root': {
          marginLeft: theme.spacing(0.5),
          marginBottom: theme.spacing(0.5),
          color: theme.palette.secondary.main
        }
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& .SCNavigationSettingsIconButton-item .MuiListItemIcon-root': {
        marginLeft: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        color: theme.palette.secondary.main
      }
    })
  }
};

export default Component;
