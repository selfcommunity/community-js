const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(0, 3),
      '& .SCNavigationToolbar-logo': {
        marginRight: theme.spacing(2),
        '& img': {
          verticalAlign: 'middle',
          maxHeight: theme.mixins.toolbar.minHeight
        }
      },
      '& .SCNavigationToolbar-navigation': {
        flexGrow: 1,
        textAlign: 'center',
        alignSelf: 'end',
        '& .SCNavigationToolbar-home, & .SCNavigationToolbar-explore': {
          padding: theme.spacing(2, 2, 1, 2),
          margin: theme.spacing(0, 2),
          color: theme.palette.primary.main,
          borderRadius: 0,
          borderBottom: `1px solid transparent`,
          '&.SCNavigationToolbar-active, &:hover': {
            color: theme.palette.secondary.main,
            borderBottom: `1px solid ${theme.palette.secondary.main}`
          }
        }
      },
      '& .SCNavigationToolbar-search': {
        flexGrow: 1,
        textAlign: 'right',
        marginRight: theme.spacing(1.5),
        '& .MuiFormControl-root': {
          width: 285,
          [theme.breakpoints.up('lg')]: {
            width: 330
          }
        }
      },
      '& .SCNavigationToolbar-profile, & .SCNavigationToolbar-notification, & .SCNavigationToolbar-messages': {
        margin: theme.spacing(0, 0.5)
      },
      '& .SCNavigationToolbar-profile .MuiAvatar-root': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCNavigationToolbar-notification, & .SCNavigationToolbar-messages': {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        borderRadius: 0,
        borderBottom: `1px solid transparent`,
        color: theme.palette.primary.main,
        '&.SCNavigationToolbar-active, &:hover': {
          color: theme.palette.secondary.main,
          borderBottom: `1px solid ${theme.palette.secondary.main}`
        }
      },
      '& .SCNavigationToolbar-settings': {
        marginLeft: theme.spacing(4.5)
      }
    })
  }
};

export default Component;
