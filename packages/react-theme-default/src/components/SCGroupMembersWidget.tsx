const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupMembersWidget-actions': {
        margin: theme.spacing(0, 0, 2, 1)
      },
      '& .SCGroupMembersWidget-badge': {
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({})
  }
};

export default Component;
