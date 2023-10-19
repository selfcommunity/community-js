const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCContributorsFeedObject-btn-participants': {
        padding: theme.spacing(0.5),
        marginLeft: theme.spacing(-0.5),
        color: 'inherit',
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.875rem'
      }
    })
  }
};

export default Component;
