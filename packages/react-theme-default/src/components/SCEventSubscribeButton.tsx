const Component = {
  styleOverrides: {
    selectRoot: ({ theme }) => ({
      backgroundColor: theme.palette.grey['A200'],
      justifyContent: 'space-between',
      height: 33,
      borderRadius: '5px',

      [theme.breakpoints.down('md')]: {
        padding: '10px'
      },

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
    requestRoot: ({ theme }) => ({}),
    menuRoot: ({ theme }) => ({
      '& .MuiPaper-root': {
        width: 195,
        borderRadius: '5px',

        '& .MuiList-root .SCEventSubscribeButton-item': {
          paddingTop: 0,
          paddingBottom: 0,
          '&.Mui-disabled': {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1)
          },

          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          },

          '& > .MuiFormControlLabel-root': {
            width: '100%',
            marginLeft: 0,
            justifyContent: 'space-between'
          }
        }
      }
    }),
    drawerRoot: ({ theme }) => ({
      '& .MuiPaper-root': {
        '& .SCEventSubscribeButton-item': {
          paddingTop: 0,
          paddingBottom: 0,

          '& .Mui-checked .MuiSvgIcon-root': {
            color: theme.palette.success.main
          },

          '& > .MuiFormControlLabel-root': {
            width: '100%',
            marginLeft: 0,
            justifyContent: 'space-between'
          }
        }
      }
    })
  }
};

export default Component;
