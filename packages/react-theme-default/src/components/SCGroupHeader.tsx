const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroupHeader-cover': {
        position: 'relative',
        height: 150,
        minHeight: 150,
        borderRadius: 0,
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        boxShadow: 'unset',
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        },
        [theme.breakpoints.up('lg')]: {
          margin: theme.spacing(0, -5, 0, -5)
        }
      },
      '& .SCGroupHeader-info': {
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
        marginTop: 0.5 * theme.selfcommunity.group.avatar.sizeLarge + 8,
        marginBottom: theme.spacing(2),
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
        [theme.breakpoints.up('lg')]: {
          margin: theme.spacing(0, -5, 0, -5)
        },
        height: 150
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
      '& .SCGroupHeader-section': {
        display: 'flex',
        justifyContent: 'center',
        '& .SCGroupHeader-name': {
          marginTop: 50,
          textAlign: 'start',
          [`& .MuiSkeleton-root`]: {
            justifyContent: 'center'
          }
        },
        '& .SCGroupHeader-actions': {
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
