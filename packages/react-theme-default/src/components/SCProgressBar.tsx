const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .SCProgressBar-bar': {
        width: '100%',
        height: 10,
        borderRadius: 5
      },
      '& .SCProgressBar-progress': {
        marginTop: theme.spacing(0.5)
      }
    })
  }
};

export default Component;