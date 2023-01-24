const Component = {
  variants: [
    {
      props: {elevation: 0},
      style: {
        border: 0,
        boxShadow: 'none'
      }
    },
    {
      props: {variant: 'outlined'},
      style: {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: 'none'
      }
    }
  ],
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: 0,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      border: `0 none`,
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius
      },
      '& .MuiCardContent-root': {
        padding: theme.spacing(3),
        '& h5': {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.common.black,
          fontSize: '1.143rem'
        },
        '& .MuiList-root': {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          '& .MuiListItem-root': {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: 0,
            paddingRight: 0,
            '& .SCBaseItemButton-text': {
              marginTop: 0,
              marginBottom: 0
            }
          }
        },
        '& > .MuiButton-sizeMedium': {
          marginLeft: theme.spacing(-2),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2)
        },
        '& a:not(.MuiButton-colorInherit):hover': {
          color: theme.palette.primary.main
        },
        '& .SCWidget-root': {
          borderRadius: 0
        }
      }
    })
  }
};

export default Component;
