const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialog-paper': {
        position: 'relative',
        '& > form': {
          zIndex: 0
        },
        '& .MuiDialogTitle-root': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: theme.spacing(0.5, 2, 0.5, 1),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.grey[400]}`,
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          '& .MuiTypography-root': {
            flexGrow: 1,
            textAlign: 'left',
            fontWeight: theme.typography.fontWeightMedium
          }
        },
        '& .MuiDialogContent-root': {
          margin: theme.spacing(7, 0),
          padding: theme.spacing(0, 2),
          '& .SCEditor-root': {
            padding: theme.spacing(1, 0),
            '& .SCEditor-placeholder': {
              left: 0,
              top: theme.spacing(1),
            },
            '& .SCEditorToolbarPlugin-root': {
              display: 'none',
              position: 'fixed',
              bottom: theme.spacing(6),
              right: theme.spacing(0.2),
              left: theme.spacing(0.2),
              marginBottom: 0
            },
            '&.SCEditor-focused .SCEditorToolbarPlugin-root': {
              display: 'flex'
            }
          }
        },
        '& .UnstableSCComposer-types': {
          position: 'fixed',
          bottom: theme.spacing(7),
          left: 0,
          right: 0,
          justifyContent: 'center'
        },
        '& .MuiDialogActions-root': {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: theme.spacing(0.5, 1),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.grey[400]}`
        }
      },
      [theme.breakpoints.up('md')]: {
        '& .MuiDialog-paper': {
          '& > form': {
            zIndex: 0
          },
          '& .MuiDialogTitle-root, & .UnstableSCComposer-types, & .MuiDialogActions-root': {
            position: 'absolute'
          },
          '& .MuiDialogContent-root': {
            minHeight: 300
          },
          '& .MuiDialogActions-root': {
            justifyContent: 'center'
          }
        },
      }
    }),
    layerTransitionRoot: ({theme}: any) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      background: theme.palette.background.paper
    })
  }
};

export default Component;
