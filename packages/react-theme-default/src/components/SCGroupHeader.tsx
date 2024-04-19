const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupHeader-cover': {
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
      '& .SCGroupHeader-info': {
        marginTop: theme.spacing(6.5),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& .SCGroupHeader-members': {
          marginBottom: `${theme.spacing(0)} !important`,
          '& .SCGroupHeader-members-counter': {
            fontSize: '1rem',
            fontWeight: theme.typography.fontWeightRegular,
            display: 'inline'
          }
        },
        '& .SCGroupHeader-visibility': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing(1),
          '& .SCGroupHeader-visibility-item': {
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightLight,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacing(0.5)
          }
        },
        '& .SCEditGroupButton-root': {
          marginLeft: 'auto',
          marginTop: theme.spacing(-4.25)
        },
        '& .SCGroupSubscribeButton-root': {
          marginTop: theme.spacing(1)
        }
      },
      '& .SCGroupHeader-avatar': {
        top: 150,
        display: 'block',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: '50%',
        '& .MuiAvatar-root': {
          height: theme.selfcommunity.group.avatar.sizeLarge,
          width: theme.selfcommunity.group.avatar.sizeLarge,
          borderRadius: '50%',
          border: `#FFF solid ${theme.spacing(0.5)}`,
          objectFit: 'cover'
        }
      },
      '& .SCGroupHeader-change-picture': {
        top: 150,
        left: '50%',
        transform: 'translate(90%, -50%)',
        position: 'relative',
        display: 'flex'
      },
      '& .SCGroupHeader-name': {
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem',
        textAlign: 'center'
      },
      '& .SCGroupHeader-change-cover': {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2)
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      position: 'relative',
      '& .SCGroupHeader-cover': {
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        },
        height: 230
      },
      '& .SCGroupHeader-avatar': {
        top: 150,
        display: 'block',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: '50%',
        [`& .MuiSkeleton-root`]: {
          border: '#FFF solid 5px'
        }
      },
      '& .SCGroupHeader-info': {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 60
      }
    })
  }
};

export default Component;
