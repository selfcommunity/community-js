const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileHeader-cover': {
        height: 300,
        minHeight: 300,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCUserProfileHeader-avatar': {
        height: theme.selfcommunity.user.avatar.sizeLarge,
        width: theme.selfcommunity.user.avatar.sizeLarge,
        top: 1.5 * theme.selfcommunity.user.avatar.sizeLarge
      },
      '& .SCUserProfileHeader-change-picture': {
        top: theme.selfcommunity.user.avatar.sizeLarge,
        left: 0.5 * theme.selfcommunity.user.avatar.sizeLarge
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeLarge,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem'
      }
    })
  }
};

export default Component;
