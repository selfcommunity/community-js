const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserInfo-field': {
        marginBottom: theme.spacing(2),
        '& h6': {
          fontSize: '1.143rem',
          fontWeight: theme.typography.fontWeightBold,
          marginBottom: theme.spacing(0.5)
        },
        '&:last-of-type': {
          marginBottom: 0
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({
      '& .SCUserInfo-caption': {
        marginTop: theme.spacing(-2),
        textAlign: 'center',
        '& .SCUserInfo-avatar': {
          margin: theme.spacing(0, 'auto', 1),
          width: theme.selfcommunity.user.avatar.sizeLarge,
          height: theme.selfcommunity.user.avatar.sizeLarge
        },
        '& .SCUserInfo-username': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.143rem',
          marginBottom: theme.spacing(1)
        }
      }
    })
  }
};

export default Component;
