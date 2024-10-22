const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: '#111111',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      [`& .SCLiveStreamRoom-preJoin`]: {
        display: 'grid',
        placeItems: 'center',
        height: '100%'
      },
      '& .lk-form-control': {
        display: 'none'
      },
      '& .lk-join-button': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark
        }
      }
    })
  }
};

export default Component;
