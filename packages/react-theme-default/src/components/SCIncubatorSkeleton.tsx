const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .MuiCardContent-root': {
        '& .SCIncubatorSkeleton-secondary': {
          marginTop: theme.spacing(1)
        },
        '& .SCIncubatorSkeleton-progress-bar': {
          marginTop: theme.spacing(1)
        }
      },
      '& .MuiCardActions-root': {
        marginLeft: theme.spacing(2)
      }
    })
  }
};

export default Component;
