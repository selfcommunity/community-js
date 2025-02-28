const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.down('md')]: {
        width: '100vw',
        flexShrink: 0
      },
      [theme.breakpoints.up('sm')]: {
        width: '300px'
      },
      '& h4': {
        fontWeight: theme.typography.fontWeightMedium
      },
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '300px'
        },
        backgroundColor: theme.palette.grey[200]
      },
      '& .SCLessonDrawer-header': {
        minHeight: '60px',
        display: 'block',
        padding: theme.spacing(1.5)
      },
      '& .SCLessonDrawer-header-content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCLessonDrawer-header-edit': {
        justifyContent: 'space-between'
      }
    })
  }
};

export default Component;
