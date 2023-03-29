const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginBottom: theme.spacing(2),
      '& .SCInlineComposer-content, & .SCInlineComposer-content:last-child': {
        padding: theme.spacing(0.5, 1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(0.5, 1, 0.5, 2)
        },
        '& .SCInlineComposer-input': {
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
        '& .SCInlineComposer-actions': {
          display: 'flex',
          '& .MuiIconButton-root': {
            [theme.breakpoints.up('sm')]: {
              marginLeft: 2,
              marginRight: 2
            }
          }
        },
        '& .SCInlineComposer-avatar': {
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
    })
  }
};

export default Component;
