const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      position: 'relative',
      width: '100%',
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
          '& .SCBaseItemButton-actions': {
            right: 0
          }
        }
      },
      '& .SCBaseItemButton-content': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
      },
      '& .SCBaseItemButton-image': {
        flexShrink: 0,
        marginRight: theme.spacing(2)
      },
      '& .SCBaseItemButton-text': {
        flex: '1 1 auto',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
        textAlign: 'left'
      },
      '& .SCBaseItemButton-primary': {
        color: theme.palette.text.primary
      },
      '& .SCBaseItemButton-secondary': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.palette.text.secondary
      },
      '& .SCBaseItemButton-actions': {
        position: 'absolute',
        right: theme.spacing(2),
        top: '50%',
        transform: 'translateY(-50%)'
      }
    })
  }
};

export default Component;
