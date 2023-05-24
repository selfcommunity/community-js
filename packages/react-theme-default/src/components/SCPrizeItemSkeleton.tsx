const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(45),
        height: theme.spacing(45),
        marginTop: theme.spacing(3)
      },
      '& .MuiCard-root': {
        [theme.breakpoints.down('md')]: {
          borderRadius: 0,
          height: '100%'
        }
      },
      '& .MuiCardContent-root': {
        justifyContent: 'center',
        '& .SCPrizeItemSkeleton-content': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme.spacing(2),
          paddingBottom: theme.spacing(8)
        }
      },
      '& .MuiCardActions-root': {
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
