const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [`& .SCLiveStreamForm-actions`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2)
      }
    })
  }
};

export default Component;
