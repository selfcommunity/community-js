const Component = {
  styleOverrides: {
    displayRoot: ({theme}: any) => ({
      '& .SCMediaShare-share-preview': {
        paddingLeft: theme.spacing(),
        paddingRight: theme.spacing()
      }
    })
  }
};

export default Component;
