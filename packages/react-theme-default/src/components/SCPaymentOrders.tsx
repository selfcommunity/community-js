const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategory-category-image': {
        paddingLeft: theme.spacing(1)
      },
      '& .SCGroup-avatar': {
        marginLeft: theme.spacing(1)
      }
    })
  }
};

export default Component;
