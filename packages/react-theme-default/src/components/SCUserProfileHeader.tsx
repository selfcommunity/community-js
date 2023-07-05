const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileHeader-cover': {
        position: 'relative',
        height: 250,
        minHeight: 250,
        borderRadius: 0,
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        boxShadow: 'unset',
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCUserProfileHeader-avatar': {
        height: theme.selfcommunity.user.avatar.sizeXLarge,
        width: theme.selfcommunity.user.avatar.sizeXLarge,
        top: 250 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge,
        display: 'block',
        position: 'relative',
        margin: '0px auto',
        borderRadius: '50%',
        border: `#FFF solid ${theme.spacing(0.5)}`,
        objectFit: 'cover'
      },
      '& .SCUserProfileHeader-change-picture': {
        top: theme.selfcommunity.user.avatar.sizeXLarge,
        left: 0.5 * theme.selfcommunity.user.avatar.sizeXLarge,
        position: 'relative',
        display: 'flex',
        margin: '0px auto'
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeXLarge + 16,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem',
        textAlign: 'center'
      },
      '& .SCUserProfileHeader-realname': {
        fontSize: '1rem',
        textAlign: 'center'
      },
      '& .SCUserProfileHeader-change-cover': {
        position: 'absolute',
        right: 10,
        bottom: 10
      }
    })
  }
};

export default Component;
