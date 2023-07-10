const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserAvatar-badge-content': {
        width: 16,
        height: 16,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.background.paper}`
      },
      '& .SCUserAvatar-badge-content-xs': {
        width: `${theme.spacing(1.75)} !important`,
        height: `${theme.spacing(1.75)} !important`
      },
      '.MuiBadge-badge': {
        right: theme.spacing(0)
      }
    })
  }
};

export default Component;
