const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    menuRoot: ({theme}: any) => ({
      '& .MuiDivider-root': {
        margin: theme.spacing(1)
      },
      '& .MuiIcon-root': {
        fontSize: '15px'
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& .SCEventActionsMenu-item': {
        paddingTop: 0,
        paddingBottom: 0
      },
      '& .MuiDivider-root': {
        margin: theme.spacing(2)
      },
      '& .MuiIcon-root': {
        fontSize: '15px'
      }
    })
  }
};

export default Component;
