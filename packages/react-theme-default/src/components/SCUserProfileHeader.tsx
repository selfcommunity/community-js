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
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1)
      },
      '& .SCUserProfileHeader-avatar': {
        top: 180,
        display: 'block',
        position: 'absolute',
        marginLeft: theme.spacing(2),
        '& > .MuiBadge-root > img': {
          height: theme.selfcommunity.user.avatar.sizeXLarge,
          width: theme.selfcommunity.user.avatar.sizeXLarge,
          borderRadius: '50%',
          border: `#FFF solid ${theme.spacing(0.5)}`,
          objectFit: 'cover'
        },
        '& .MuiBadge-badge': {
          right: theme.spacing(1),
          top: theme.spacing(3),
          '& .SCUserAvatar-badge-content': {
            width: 32,
            height: 32
          }
        }
      },
      '& .SCUserProfileHeader-change-picture': {
        top: 240,
        left: 70,
        position: 'relative',
        display: 'flex',
        marginLeft: theme.spacing(2)
      },
      '& .SCUserProfileHeader-info': {
        marginLeft: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
          marginLeft: theme.spacing(2)
        },
        '& .SCUserProfileHeader-username': {
          marginTop: 0.5 * theme.selfcommunity.user.avatar.sizeXLarge + 8,
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.429rem',
          textAlign: 'start'
        },
        '& .SCUserProfileHeader-realname': {
          fontSize: '1rem',
          textAlign: 'start',
          marginTop: theme.spacing(1)
        },
        '& .SCUserProfileHeader-website': {
          textDecoration: 'none',
          color: theme.palette.secondary.main,
          marginTop: theme.spacing(1)
        }
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
