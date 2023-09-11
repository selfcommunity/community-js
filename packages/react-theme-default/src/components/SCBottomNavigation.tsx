const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCBottomNavigation-action': {
        color: theme.palette.primary.main,
        borderTop: `1px solid transparent`,
        '&.Mui-selected, &:hover': {
          color: theme.palette.secondary.main,
          borderTop: `1px solid ${theme.palette.secondary.main}`
        }
      },
      '&.SCBottomNavigation-ios': {
        paddingBottom: '10px'
      }
    })
  }
};

export default Component;
