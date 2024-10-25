const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100vh',
      overflowY: 'hidden',
      [`& .SCLiveStreamVideoConference-end-conference-wrap`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        [`& .SCLiveStreamVideoConference-btn-back-home`]: {
          marginTop: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
