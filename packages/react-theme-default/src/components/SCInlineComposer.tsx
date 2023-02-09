const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCInlineComposer-content, & .SCInlineComposer-content:last-child': {
        padding: theme.spacing(0.5, 1),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(0.5, 1, 0.5, 2)
        },
        '& .SCInlineComposer-input': {
          display: 'flex',
          '& .MuiButton-root': {
            fontWeight: theme.typography.fontWeightLight,
            letterSpacing: '0.17px',
            padding: theme.spacing(0.5, 0),
            '&:hover': {
              color: theme.palette.text.secondary,
              background: 'white',
              border: 'none'
            }
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
          }
        }
      }
    })
  }
};

export default Component;
