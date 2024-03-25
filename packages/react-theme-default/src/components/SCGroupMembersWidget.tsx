const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupMembersWidget-button': {
        marginTop: theme.spacing(1)
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({})
  }
};

export default Component;
