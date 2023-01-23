const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCScrollContainer-scrollbar': {
        width: 5,
        borderRadius: 5,
        overflowX: 'hidden',
        backgroundColor: theme.palette.background.default,
        transition: 'opacity 200ms ease-out'
      },
      '& .SCScrollContainer-scroll-thumb': {
        width: 5
      }
    })
  }
};

export default Component;
