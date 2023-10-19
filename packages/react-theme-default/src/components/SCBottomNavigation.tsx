const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      backgroundColor: theme.palette?.navbar?.main,
      '& .SCBottomNavigation-action': {
        fontSize: '1.57rem',
        color: theme.palette.primary.main,
        borderTop: `1px solid transparent`,
        minWidth: 56,
        '&.Mui-selected, &:hover': {
          color: theme.palette.secondary.main,
          borderTop: `1px solid ${theme.palette.secondary.main}`
        },
        '&.SCBottomNavigation-composer': {
          '&.Mui-selected, &:hover': {
            color: theme.palette.secondary.main,
            borderTop: '0 none'
          },
        },
      },
      '&.SCBottomNavigation-ios': {
        paddingBottom: '15px'
      }
    })
  }
};

export default Component;
