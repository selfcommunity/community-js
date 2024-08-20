import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCEventHeader-cover': {
        position: 'relative',
        minHeight: 150,
        background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)',
        height: 230,
        borderRadius: 0,
        [theme.breakpoints.up('md')]: {
          borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        }
      },
      '& .SCEventHeader-time': {
        textTransform: 'uppercase',
        fontSize: '1.143rem',
        fontWeight: theme.typography.fontWeightLight,
        color: theme.palette.text.secondary
      },
      '& .SCEventHeader-info': {
        marginTop: theme.spacing(6),
        '& .SCEventHeader-name': {
          fontSize: '1.857rem',
          fontWeight: theme.typography.fontWeightBold
        },
        '& .SCEventHeader-visibility': {
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: theme.spacing(0.5),
          '& .SCEventHeader-visibility-item': {
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightLight,
            color: theme.palette.text.secondary,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacing(0.5)
          }
        },
        '& .SCEditEvenButton-root': {
          marginLeft: 'auto',
          marginTop: theme.spacing(-4.25),
          marginRight: theme.spacing(1)
        },
        '& .SCEvenSubscribeButton-root': {
          marginTop: theme.spacing(1)
        },
        '& .SCUser-root': {
          borderTop: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
          padding: `${theme.spacing(0.5)} !important`,
          marginTop: theme.spacing(1),
          '& .SCBaseItemButton-actions': {
            maxWidth: 'none',
            width: '60%',
            '& .SCEventHeader-multi-actions': {
              display: 'flex',
              justifyContent: 'space-between'
            },
            '& .SCEventSubscribeButton-select-root': {
              float: 'right'
            }
          }
        }
      },
      // '& .SCEventHeader-avatar': {
      //   top: 230,
      //   display: 'block',
      //   position: 'absolute',
      //   transform: 'translate(-50%, -50%)',
      //   left: '50%',
      //   '& .MuiAvatar-root': {
      //     height: theme.selfcommunity.group.avatar.sizeLarge,
      //     width: theme.selfcommunity.group.avatar.sizeLarge,
      //     borderRadius: '50%',
      //     border: `#FFF solid ${theme.spacing(0.5)}`,
      //     objectFit: 'cover'
      //   }
      // },
      '& .SCEventHeader-name': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      position: 'relative',
      '& .SCEventHeader-cover': {
        height: 190
      },
      '& .SCEventHeader-avatar': {
        top: 140,
        display: 'block',
        position: 'absolute',
        marginLeft: theme.spacing(2),
        [`& .MuiSkeleton-root`]: {
          border: '#FFF solid 5px'
        }
      },
      '& .SCEventHeader-info': {
        marginTop: 60
      }
    })
  }
};

export default Component;
