const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      [`& .SCLiveStreamRoom-preJoin`]: {
        padding: theme.spacing(2),
        display: 'grid',
        placeItems: 'center',
        height: '100%'
      },
      [`& .SCLiveStreamRoom-conference`]: {
        width: '100%'
      },
      '& .lk-prejoin': {
        width: 'min(100%, 620px)',
        backgroundColor: '#111111',
        borderRadius: theme.shape.borderRadiusSm
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
