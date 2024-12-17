const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLessonComponent-info': {
        marginTop: theme.spacing(2)
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(40)
        },
        backgroundColor: theme.palette.grey['A200']
      },
      '& .SCLessonComponent-drawer-header': {
        minHeight: theme.mixins.toolbar.minHeight,
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCLessonComponent-drawer-header-edit': {
        justifyContent: 'center',
        gap: theme.spacing(2)
      },
      '& .SCLessonComponent-drawer-content': {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        '& .MuiFormLabel-root': {
          fontWeight: 700,
          color: 'inherit'
        },
        '& .SCLessonComponent-settings': {
          marginTop: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
