const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupInfoWidget-title': {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(1)
      },
      '& .SCGroupInfoWidget-description': {
        marginBottom: theme.spacing(1)
      },
      '& .SCGroupInfoWidget-privacy': {
        marginBottom: theme.spacing(1),
        '& .SCGroupInfoWidget-privacy-title': {
          color: theme.palette.secondary.main,
          fontWeight: theme.typography.fontWeightMedium,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(0.5)
        }
      },
      '& .SCGroupInfoWidget-visibility-title': {
        color: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5)
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
