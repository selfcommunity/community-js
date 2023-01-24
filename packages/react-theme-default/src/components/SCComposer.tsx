const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCComposer-title': {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        padding: theme.spacing(1, 2)
      },
      '& .SCComposer-actions': {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        padding: theme.spacing(2),
        '& > p.MuiTypography-alignLeft > .MuiIconButton-root': {
          marginLeft: theme.spacing(0.3),
          marginRight: theme.spacing(0.3),
          '&:first-child': {
            marginLeft: 0
          },
          '&:last-child': {
            marginRight: 0
          }
        },
        '& > p.MuiTypography-alignRight > .MuiIconButton-root': {
          marginRight: theme.spacing(1.5)
        }
      },
      '& .SCComposer-block': {
        padding: theme.spacing(1)
      },
      '& .SCComposer-editor': {
        '& .SCEditor-placeholder': {
          top: theme.spacing(1),
          left: theme.spacing(1)
        }
      },
      '& .MuiDialog-container': {
        '& .MuiDialog-paper': {
          boxShadow: theme.shadows[12],
          [theme.breakpoints.up('md')]: {
            borderRadius: theme.shape.borderRadius
          }
        }
      }
    })
  }
};

export default Component;
