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
      '&.MuiPaper-elevation0': {
        borderRadius: 0
      },
      '& .MuiCardContent-root': {
        padding: theme.spacing(2.2),
        '& h5': {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.common.black,
          fontSize: '1.143rem'
        },
        '& .MuiList-root': {
          paddingTop: theme.spacing(2),
          paddingBottom: 0,
          '& .MuiListItem-root:first-of-type': {
            paddingTop: 0
          },
          '& .MuiListItem-root': {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: 0,
            paddingRight: 0,
            '& .SCBaseItemButton-text, & .SCBaseItem-text': {
              marginTop: 0,
              marginBottom: 0
            },
            '& .SCWidget-root': {
              borderRadius: 0
            }
          }
        },
        '& > .MuiTypography-body2': {
          paddingTop: theme.spacing(2)
        },
        '& > .MuiButton-sizeMedium': {
					marginTop: theme.spacing(1),
          padding: theme.spacing(0),
          color: theme.palette.secondary.main
        }
      }
    })
  }
};

export default Component;
