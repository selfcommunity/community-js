const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      paddingBottom: 0,
      overflow: 'visible',
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius
      },
      '& .MuiChip-root': {
        height: '18px'
      },
      '& .SCUser-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium,
        '& img': {
          borderRadius: 0
        }
      },
      '& .SCUser-staff-badge-label': {
        marginLeft: theme.spacing(1),
        borderRadius: 0,
        fontSize: '0.5rem'
      },
      '& .SCUser-group-admin-badge-label': {
        marginLeft: theme.spacing(1),
        fontSize: '0.75rem',
        color: theme.palette.secondary.main
      },
      '& .SCBaseItemButton-primary': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCBaseItemButton-secondary': {
        fontSize: '0.857rem'
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
