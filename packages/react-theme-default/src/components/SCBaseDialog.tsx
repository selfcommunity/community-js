const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .infinite-scroll-component > .': {
        marginBottom: theme.spacing(2.5)
      }
    })
  }
};

export default Component;
