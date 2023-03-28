const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      paddingBottom: 0,
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
      '& .SCUser-staff-badge': {
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.background.paper}`
      },
      '& .SCUser-staff-badge-label': {
        marginLeft: theme.spacing(1),
        borderRadius: 0,
        fontSize: '0.5rem'
      },
      '& .SCUser-staff-badge-icon': {
        top: '25%',
        right: '5%'
      },
      '& .SCBaseItemButton-primary': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCBaseItemButton-secondary': {
        fontSize: '0.857rem'
      }
    })
  }
};

export default Component;
