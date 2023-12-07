const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDrawer-paperAnchorBottom': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        maxHeight: '75vh',
        paddingTop: theme.shape.borderRadius,
        '&:before': {
          content: '""',
          border: `1px solid ${theme.palette.primary.main}`,
          width: 60,
          position: 'absolute',
          top: theme.shape.borderRadius / 2,
          left: 'calc(50% - 30px)'
        },
        '& > *': {
          paddingTop: 0
        }
      }
    })
  }
};

export default Component;
