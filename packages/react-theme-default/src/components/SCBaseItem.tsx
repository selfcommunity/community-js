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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.palette.text.secondary
      }
    })
  }
};

export default Component;
