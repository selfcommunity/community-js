const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupMembersWidget-actions': {
        margin: theme.spacing(0, 0, 2, 1)
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({})
  }
};

export default Component;
