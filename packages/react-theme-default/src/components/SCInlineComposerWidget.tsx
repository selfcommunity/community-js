const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginBottom: theme.spacing(2),
      '& .SCInlineComposerWidget-content, & .SCInlineComposerWidget-content:last-child': {
        padding: theme.spacing(0.5, 1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(0.5, 1, 0.5, 2)
        },
        '& .SCInlineComposerWidget-input': {
          display: 'flex',
          flexGrow: 2,
          '& .MuiButton-root': {
            fontWeight: theme.typography.fontWeightLight,
            letterSpacing: '0.17px',
            padding: theme.spacing(0.5, 0),
            '&:hover': {
              color: theme.palette.text.secondary,
              background: 'white',
              border: 'none'
            }
          },
          ['& .MuiButton-text']: {
            justifyContent: 'flex-start',
            textTransform: 'none'
          }
        },
        '& .SCInlineComposerWidget-avatar': {
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(2)
          },
          '& .MuiAvatar-root': {
            width: theme.selfcommunity.user.avatar.sizeMedium,
            height: theme.selfcommunity.user.avatar.sizeMedium
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginBottom: theme.spacing(2),
      '& .SCInlineComposerWidget-content, & .SCInlineComposerWidget-content:last-child': {
        padding: theme.spacing(0.5, 1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(0.5, 1, 0.5, 2)
        },
        '& .SCInlineComposerWidget-input': {
          display: 'flex',
          flexGrow: 2,
          height: 30,
          width: '80%',
          '& .MuiSkeleton-root': {
            width: '100%',
            height: '100%'
          }
        },
        '& .SCInlineComposerWidget-avatar': {
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(2)
          },
          '& .MuiSkeleton-root': {
            width: theme.selfcommunity.user.avatar.sizeMedium,
            height: theme.selfcommunity.user.avatar.sizeMedium
          }
        }
      }
    })
  }
};

export default Component;
