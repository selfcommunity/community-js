const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroups-groups': {
        marginTop: theme.spacing(3),
        '& .SCGroups-item': {
          padding: theme.spacing(2),
          width: 'auto',
          '& > div': {
            cursor: 'default',
            padding: theme.spacing(1)
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCGroups-groups': {
        marginTop: theme.spacing(3),
        '& .SCGroup-skeleton-root': {
          padding: theme.spacing(1.5),
          width: 'auto'
        }
      }
    })
  }
};

export default Component;
