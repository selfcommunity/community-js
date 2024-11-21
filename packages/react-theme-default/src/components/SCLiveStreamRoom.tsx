const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      [`& .SCLiveStreamRoom-content`]: {
        width: '100%'
      },
      [`& .SCLiveStreamRoom-prejoin`]: {
        padding: theme.spacing(2),
        display: 'grid',
        placeItems: 'center',
        height: '100%',
        position: 'relative',
        '& .lk-form-control': {
          display: 'none'
        }
      },
      [`& .SCLiveStreamRoom-prejoin-loading`]: {
        '& .lk-prejoin': {
          opacity: 0.5
        }
      },
      [`& .SCLiveStreamRoom-conference`]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111'
      },
      [`& .SCLiveStreamRoom-prejoin-loader`]: {
        maxWidth: 620,
        width: '100%',
        position: 'absolute',
        textAlign: 'center',
        '& .MuiTypography-root': {
          color: '#111111'
        }
      },
      [`& .SCLiveStreamRoom-end-prejoin-content`]: {
        color: theme.palette.common.black,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30
      },
      '& .lk-prejoin': {
        maxWidth: 620,
        width: '100%',
        backgroundColor: '#111111',
        borderRadius: theme.shape.borderRadiusSm
      },
      '& .lk-join-button': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark
        }
      }
    }),
    dialogRoot: ({theme}: any) => ({
      [`& .SCLiveStreamRoom-end-conference-wrap`]: {
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
