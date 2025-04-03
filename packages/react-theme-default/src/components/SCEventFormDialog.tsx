const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialogTitle-root': {
        '& span': {
          flexGrow: 1,
          textAlign: 'center'
        }
      },
      [theme.breakpoints.down('sm')]: {
        '& .MuiDialogContent-root': {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2)
        },
        '& .SCEventForm-actions': {
          marginBottom: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
