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
      '& .SCUserProfileHeader-infops-section': {
        display: 'flex',
        justifyContent: 'space-between'
      },
      '& .SCUserProfileHeader-avatar': {
        height: theme.selfcommunity.user.avatar.sizeLarge,
        width: theme.selfcommunity.user.avatar.sizeLarge,
        top: 250 - 0.5 * theme.selfcommunity.user.avatar.sizeLarge,
        display: 'block',
        position: 'absolute',
        marginLeft: theme.spacing(2),
        borderRadius: '50%',
        border: `#FFF solid ${theme.spacing(0.5)}`,
        objectFit: 'cover'
      },
      '& .SCUserProfileHeader-change-picture': {
        top: 270 - 0.5 * theme.selfcommunity.user.avatar.sizeLarge,
        left: theme.selfcommunity.user.avatar.sizeLarge - 10,
        position: 'relative',
        display: 'flex',
        marginLeft: theme.spacing(2)
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeLarge + 16,
        marginLeft: theme.spacing(2),
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem',
        textAlign: 'start'
      },
      '& .SCUserProfileHeader-realname': {
        fontSize: '1rem',
        textAlign: 'start',
        paddingBottom: theme.spacing(),
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2)
      },
      '& .SCUserProfileHeader-change-cover': {
        position: 'absolute',
        right: 10,
        bottom: 10
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      position: 'relative',
      '& .SCUserProfileHeader-avatar': {
        position: 'absolute',
        top: 190,
        width: '100%',
        [`& .MuiSkeleton-root`]: {
          border: '#FFF solid 5px',
          margin: '0 auto'
        }
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 50,
        textAlign: 'center'
      }
    })
  }
};

export default Component;
