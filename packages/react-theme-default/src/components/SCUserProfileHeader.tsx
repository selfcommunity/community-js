const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserProfileHeader-cover': {
        position: 'relative',
        height: 230,
        minHeight: 150,
        borderRadius: 0,
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        boxShadow: 'unset',
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        }
      },
      '& .SCUserProfileHeader-infops-section': {
        display: 'flex',
        justifyContent: 'space-between'
      },
      '& .SCUserProfileHeader-avatar': {
        top: 180,
        [theme.breakpoints.up('lg')]: {
          left: theme.selfcommunity.user.avatar.sizeXLarge / 2,
          marginLeft: 0
        },
        display: 'block',
        position: 'absolute',
        marginLeft: theme.spacing(1),
        '& > .MuiBadge-root > img': {
          height: theme.selfcommunity.user.avatar.sizeXLarge,
          width: theme.selfcommunity.user.avatar.sizeXLarge,
          borderRadius: '50%',
          border: `#FFF solid ${theme.spacing(0.5)}`,
          objectFit: 'cover'
        },
        '& .MuiBadge-badge .SCUserAvatar-badge-content': {
          width: 32,
          height: 32
        }
      },
      '& .SCUserProfileHeader-change-picture': {
        top: 215,
        [theme.breakpoints.up('lg')]: {
          left: 155 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge
        },
        left: 70,
        position: 'relative',
        display: 'flex',
        marginLeft: theme.spacing(2)
      },
      '& .SCUserProfileHeader-username': {
        marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeXLarge + 8,
        marginLeft: theme.spacing(2),
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem',
        textAlign: 'start'
      },
      '& .SCUserProfileHeader-realname': {
        fontSize: '1rem',
        textAlign: 'start',
        paddingBottom: theme.spacing(1),
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
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        },
        height: 230
      },
      '& .SCUserProfileHeader-avatar': {
        display: 'block',
        position: 'absolute',
        top: 230 - 0.5 * theme.selfcommunity.user.avatar.sizeXLarge - 5,
        marginLeft: theme.spacing(4),
        [`& .MuiSkeleton-root`]: {
          border: '#FFF solid 5px'
        }
      },
      '& .SCUserProfileHeader-section': {
        display: 'flex',
        justifyContent: 'space-between',
        '& .SCUserProfileHeader-username': {
          marginTop: 50,
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
