const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCIncubatorListWidget-header': {
        display: 'flex',
        alignItems: 'center'
      },
      '& .SCIncubatorListWidget-actions': {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }),
    dialogRoot: ({theme}: any) => ({}),
    skeletonRoot: ({theme}: any) => ({}),
    createDialogRoot: ({theme}: any) => ({
      margin: 2,
      [theme.breakpoints.down(500)]: {
        minWidth: 300
      },
      '& .SCIncubatorListWidget-intro': {
        whiteSpace: 'pre-line'
      },
      '& .SCIncubatorListWidget-form': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      },
      '& .SCIncubatorListWidget-name': {
        '& .MuiInputBase-root': {
          height: '40px'
        }
      },
      '& .SCIncubatorListWidget-submitted-message': {
        padding: theme.spacing(1),
        borderRadius: '8px',
        backgroundColor: '#bdd5bd'
      }
    })
  }
};

export default Component;
