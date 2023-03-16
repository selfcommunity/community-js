const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserInfoDialog-caption': {
        marginTop: theme.spacing(-2),
        textAlign: 'center',
        '& .SCUserInfoDialog-avatar': {
          margin: theme.spacing(0, 'auto', 1),
          width: theme.selfcommunity.user.avatar.sizeLarge,
          height: theme.selfcommunity.user.avatar.sizeLarge
        },
        '& .SCUserInfoDialog-username': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.143rem',
          marginBottom: theme.spacing(1)
        }
      }
    })
  }
};

export default Component;
