const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      '& .SCGroupFeedTemplate-feed': {
        marginTop: theme.spacing(2)
      },
      '& .SCGroupFeedTemplate-tabs': {
        '& .MuiTabs-flexContainer': {
          borderBottom: `2px solid ${theme.palette.grey[300]}`
        },
        '& .MuiTabs-indicator': {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        },
        '& .MuiTabs-indicatorSpan': {
          maxWidth: '40%',
          width: '100%',
          backgroundColor: theme.palette.secondary.main
        }
      },
      '& .SCGroupFeedTemplate-tab-content': {
        '& .SCGroupFeedTemplate-members': {
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2)
        }
      }
    }),
    tabRoot: ({theme}: any) => ({
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightBold
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: 30
      }
    })
  }
};

export default Component;
