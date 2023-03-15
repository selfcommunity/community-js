const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFollowAction-button': {
        color: theme.palette.primary.main,
        '&.SCFollowAction-iconized': {
          borderRadius: '50%',
          padding: theme.spacing(1),
          minWidth: 'auto',
          fontSize: '1.429rem'
        },
        '&.SCFollowAction-followed': {
          color: theme.palette.secondary.main
        }
      }
    })
  }
};

export default Component;
