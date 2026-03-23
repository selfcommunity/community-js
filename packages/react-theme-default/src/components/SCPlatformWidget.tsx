const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '&.SCPlatformWidget-tutorialOpen': {
        position: 'relative',
        zIndex: theme.zIndex.drawer + 2,
        '& .SCPlatformWidget-.tutorial': {
          padding: 0
        }
      },
      '& .SCPlatformWidget-title': {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(1)
      },
      '& .SCPlatformWidget-content': {
        padding: `${theme.spacing(2)} 0 0`,
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      },
      '& .SCPlatformWidget-actions': {
        display: 'flex',
        paddingBottom: 0,
        boxShadow: 'inset -1px -3px 7px -4px #CECECE',
        WebkitOverflowScrolling: 'touch',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none' /* Firefox */,
        MsOverflowStyle: 'none' /* IE and Edge */,
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      },
      '& .SCPlatformWidget-action': {
        padding: `0 2px ${theme.spacing(2)} 2px`,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        '& .MuiButton-root': {
          color: theme.palette.getContrastText(theme.palette.common.white),
          backgroundColor: theme.palette.common.white,
          '&:hover': {
            color: theme.palette.getContrastText(theme.palette.primary.main),
            backgroundColor: theme.palette.primary.main
          }
        }
      },
      '& .SCPlatformWidget-tutorialContent': {
        width: '100%'
      },
      '& .SCPlatformWidget-divider': {
        paddingTop: theme.spacing()
      },
      '& .SCPlatformWidget-tutorialTitle': {
        position: 'relative',
        fontWeight: 700,
        fontSize: 15,
        padding: `${theme.spacing(3)} ${theme.spacing()} ${theme.spacing()} ${theme.spacing(3)}`
      },
      '& .SCPlatformWidget-tutorialTitleClose': {
        position: 'absolute',
        top: theme.spacing(3),
        right: theme.spacing(3)
      },
      '& .SCPlatformWidget-tutorialDesc': {
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.grey[700],
        padding: `0 ${theme.spacing(3)} ${theme.spacing()} ${theme.spacing(3)}`
      },
      '& .SCPlatformWidget-tutorialControls': {
        padding: theme.spacing(2)
      },
      '& .SCPlatformWidget-actionHighlighted': {
        position: 'relative',
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          bottom: -11,
          width: 10,
          height: 10,
          transform: 'translateY(-50%) rotate(45deg)',
          boxShadow: '0px -20px 20px 0px #CECECE',
          zIndex: 0,
          backgroundColor: theme.palette.common.white
        },
        '& .MuiButton-root': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white
        }
      },
      '& .SCPlatformWidget-btnStep': {
        borderRadius: 3
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCPlatformWidget-skeleton-content': {
        padding: theme.spacing(2)
      },
      '& .SCPlatformWidget-skeleton-title': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: theme.spacing()
      },
      '& .SCPlatformWidget-skeleton-actions': {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: theme.spacing()
      },
      '& .SCPlatformWidget-skeleton-tutorial': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  }
};

export default Component;
