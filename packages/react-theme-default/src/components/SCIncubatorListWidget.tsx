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
    })
  }
};

export default Component;
