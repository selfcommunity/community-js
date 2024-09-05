const Component = {
  styleOverrides: {
    selectRoot: ({theme}: any) => ({
      backgroundColor: theme.palette.grey['A200'],
      justifyContent: 'space-between',
      height: 33,
      borderRadius: '5px',
      '&:hover, &:active': {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        '& .MuiIcon-root': {
          color: theme.palette.common.white
        }
      },
      '&.SCEventSubscribeButton-going': {
        backgroundColor: `${theme.palette.success.dark} !important`,
        color: theme.palette.common.white,
        '& .MuiIcon-root': {
          color: theme.palette.common.white
        },
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
          color: theme.palette.common.white,
          '& .MuiIcon-root': {
            color: theme.palette.common.white
          }
        }
      },
      '&.SCEventSubscribeButton-not-going': {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.common.white,
        '& .MuiIcon-root': {
          color: theme.palette.common.white
        },
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
          color: theme.palette.common.white,
          '& .MuiIcon-root': {
            color: theme.palette.common.white
          }
        }
      }
    }),
    requestRoot: ({theme}: any) => ({}),
    menuRoot: ({theme}: any) => ({
      '& .MuiPaper-root': {
        width: 195,
        borderRadius: '5px',
        '& .MuiList-root .SCEventSubscribeButton-item': {
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,
          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          }
        }
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& .MuiPaper-root': {
        '& .SCEventSubscribeButton-item': {
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,
          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          }
        }
      }
    })
  }
};

export default Component;
