const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      width: '100%',
      borderRadius: 0,
      '& .MuiCardContent-root': {
        padding: 0,
        '& .MuiList-root .MuiListItem-root': {
          height: theme.spacing(10)
        },
        '&:last-child': {
          paddingBottom: 0
        }
      }
    })
  }
};

export default Component;
