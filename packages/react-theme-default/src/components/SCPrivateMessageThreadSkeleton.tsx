const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      '& .MuiCardContent-root': {
        padding: 0,
        '& .MuiList-root .MuiListItem-root': {
          padding: theme.spacing(0, 1, 0, 1),
          height: theme.spacing(10),
          [theme.breakpoints.up('sm')]: {
            width: '80%'
          }
        },
        '&:last-child': {
          paddingBottom: 0
        }
      }
    })
  }
};

export default Component;
