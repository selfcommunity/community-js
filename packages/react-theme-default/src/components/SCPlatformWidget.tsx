const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(2)
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCPlatformWidget-skeleton-content': {
        padding: theme.spacing(2)
      },
      '& .SCPlatformWidget-skeleton-title': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: theme.spacing()
      },
      '& .SCPlatformWidget-skeleton-actions': {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: theme.spacing()
      },
      '& .SCPlatformWidget-skeleton-tutorial': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  }
};

export default Component;
