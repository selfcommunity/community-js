const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .MuiCardContent-root': {
        padding: theme.spacing(1)
      },
      '& .SCIncubator-name': {
        display: 'flex'
      },
      '& .SCIncubator-slogan': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      '& .SCIncubator-progress-bar': {
        position: 'relative',
        marginTop: theme.spacing(1),
        '& .MuiLinearProgress-root': {
          height: theme.spacing(3)
        },
        '& .MuiGrid-item': {
          paddingTop: theme.spacing(0)
        }
      },
      '& .MuiCardActions-root': {
        marginLeft: theme.spacing(1)
      }
    })
  }
};

export default Component;
