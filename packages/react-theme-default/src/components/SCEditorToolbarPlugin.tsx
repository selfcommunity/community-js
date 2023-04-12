const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'left',
      marginBottom: theme.spacing(1),
      padding: theme.spacing(0.5, 0, 0, 0),
      overflowX: 'scroll',
      MsOverflowStyle: 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      '& .MuiTextField-root': {
        minWidth: 100,
        margin: theme.spacing(0, 0.5)
      }
    })
  }
};

export default Component;
