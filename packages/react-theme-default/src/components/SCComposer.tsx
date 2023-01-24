const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialog-paper': {
        padding: theme.spacing(2, 3, 3)
      },
      '& .SCComposer-title': {
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
        padding: theme.spacing(0, 0, 2, 0),
        lineHeight: 1,
        '& .SCComposer-types .MuiInputBase-input': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.286rem'
        },
        '& .MuiIconButton-root': {
          fontSize: '1rem'
        }
      },
      '& .SCComposer-content': {
        padding: theme.spacing(3, 0),
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& .SCComposer-editor': {
          padding: 0,
          fontSize: '1rem',
          minHeight: 'auto',
          '& .SCEditor-placeholder': {
            top: 0,
            left: 0
          },
          '& .SCEditor-actions': {
            bottom: theme.spacing(4)
          }
        },
        '& .SCComposer-medias, & .SCComposer-audience, & .SCComposer-block': {
          margin: theme.spacing(1, 0),
          padding: 0
        }
      },
      '& .SCComposer-actions': {
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        padding: theme.spacing(3, 0, 0, 0),
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
