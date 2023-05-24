const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '&.MuiPaper-elevation': {
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '&.MuiPaper-elevation0': {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          '& .SCBaseItem-actions': {
            right: 0
          }
        }
      },
      '& .SCBaseItem-content': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
      },
      '& .SCBaseItem-image': {
        flexShrink: 0,
        marginRight: theme.spacing(2)
      },
      '& .SCBaseItem-text': {
        flex: '1 1 auto',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
        textAlign: 'left',
        width: '100%'
      },
      '& .SCBaseItem-primary': {
        color: theme.palette.text.primary
      },
      '& .SCBaseItem-secondary': {
        color: theme.palette.text.secondary
      },
      '& .SCBaseItem-primary, & .SCBaseItem-secondary': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
      },
      '&.SCBaseItem-with-actions': {
        '& .SCBaseItem-text < *': {
          maxWidth: `calc(100% - ${theme.spacing(14)})`
        },
        '& .SCBaseItem-actions': {
          position: 'absolute',
          right: theme.spacing(2),
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: theme.spacing(14)
        }
      }
    })
  }
};

export default Component;
