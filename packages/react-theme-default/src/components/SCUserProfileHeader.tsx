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
        [theme.breakpoints.up('lg')]: {
          margin: theme.spacing(0, -5, 0, -5)
        }
      },
      '& .SCUserProfileHeader-infops-section': {
        display: 'flex',
        justifyContent: 'space-between'
      },
      '& .SCUserProfileHeader-avatar': {
        height: theme.selfcommunity.user.avatar.sizeXLarge,
        width: theme.selfcommunity.user.avatar.sizeXLarge,
        top: 250 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge,
        [theme.breakpoints.up('lg')]: {
          left: theme.selfcommunity.user.avatar.sizeXLarge / 2,
          marginLeft: 0
        },
        display: 'block',
        position: 'absolute',
        borderRadius: '50%',
        border: `#FFF solid ${theme.spacing(0.5)}`,
        objectFit: 'cover',
        marginLeft: theme.spacing(1)
      },
      '& .SCUserProfileHeader-change-picture': {
        top: 280 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge,
        [theme.breakpoints.up('lg')]: {
          left: 155 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge
        },
        left: 70,
        position: 'relative',
        display: 'flex',
        marginLeft: theme.spacing(2)
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeXLarge + 16,
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
      '& .SCUserProfileHeader-cover': {
        [theme.breakpoints.up('lg')]: {
          margin: theme.spacing(0, -5, 0, -5)
        },
        height: 250
      },
      '& .SCUserProfileHeader-avatar': {
        display: 'block',
        position: 'absolute',
        top: 250 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge,
        marginLeft: theme.spacing(4),
        [`& .MuiSkeleton-root`]: {
          border: '#FFF solid 5px'
        }
      },
      '& .SCUserProfileHeader-section': {
        display: 'flex',
        justifyContent: 'space-between',
        '& .SCUserProfileHeader-username': {
          marginTop: 60,
          textAlign: 'start',
          [`& .MuiSkeleton-root`]: {
            position: 'absolute',
            marginLeft: theme.spacing(4)
          }
        },
        '& .SCUserProfileHeader-actions': {
          [theme.breakpoints.up('md')]: {
            margin: theme.spacing(1, 2, 2, 2)
          },
          height: 'fit-content',
          marginTop: theme.spacing(1)
        }
      }
    })
  }
};

export default Component;
