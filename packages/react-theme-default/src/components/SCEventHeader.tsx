import { alpha } from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({ theme, isEventAdmin, isEventFinished }: any) => ({
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
      '& .SCEventHeader-in-progress': {
        color: theme.palette.secondary.main,
        paddingLeft: theme.spacing(2),
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',

        '&:before': {
          content: '""',
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          backgroundColor: theme.palette.secondary.main,
          animation: 'pulse-animation 2s linear infinite',

          '@keyframes pulse-animation': {
            '0%': {
              opacity: 1
            },
            '50%': {
              opacity: 0
            },
            '100%': {
              opacity: 1
            }
          }
        }
      },
      '& .SCEventHeader-chip': {
        marginLeft: theme.spacing(2),
        marginBottom: '5px',

        '& .SCEventHeader-chip-icon': {
          marginLeft: theme.spacing(1)
        }
      },
      '& .SCEventHeader-time': {
        textTransform: 'uppercase',
        fontSize: '1.143rem',
        fontWeight: theme.typography.fontWeightLight,
        color: isEventFinished ? theme.palette.grey[500] : theme.palette.text.secondary,
        paddingLeft: theme.spacing(2)
      },
      '& .SCEventHeader-info': {
        marginTop: theme.spacing(6),
        '& .SCEventHeader-name': {
          fontSize: '1.857rem',
          fontWeight: theme.typography.fontWeightBold,
          paddingLeft: theme.spacing(2),
          color: isEventFinished ? theme.palette.grey[500] : 'inherit'
        },
        '& .SCEventHeader-visibility': {
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: theme.spacing(0.5),
          paddingLeft: theme.spacing(2),
          color: isEventFinished ? theme.palette.grey[500] : 'inherit',
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
          marginTop: theme.spacing(1),
          '& .SCBaseItemButton-content': {
            paddingLeft: theme.spacing(2)
          },
          '& .SCBaseItemButton-actions': {
            maxWidth: 'none',
            [theme.breakpoints.up('sm')]: {
              width: isEventAdmin && '60%'
            },
            '& .SCEventHeader-multi-actions': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '& .SCEventInviteButton-root': {
                marginRight: theme.spacing(1)
              }
            }
          }
        },
        '& .SCUser-skeleton-root': {
          marginTop: theme.spacing(2),
          '& .SCBaseItem-content': {
            paddingLeft: theme.spacing(2)
          },
          '& .SCBaseItem-actions': {
            paddingRight: theme.spacing(2)
          }
        }
      },
      '& .SCEventHeader-name': {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.429rem'
      }
    }),
    skeletonRoot: ({ theme }: any) => ({
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
        marginTop: 60,
        marginLeft: theme.spacing(2)
      }
    })
  }
};

export default Component;
