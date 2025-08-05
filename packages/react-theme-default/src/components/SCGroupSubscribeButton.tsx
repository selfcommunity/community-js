const Component = {
  styleOverrides: {
    buyButtonRoot: ({theme}) => ({
      border: `1px solid transparent`,
      '&:hover, &:active': {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '& .MuiIcon-root': {
          color: theme.palette.primary.main
        }
      }
    })
  }
};

export default Component;
