const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCContributorsFeedObject-btn-participants': {
        marginLeft: theme.spacing(-1),
        color: 'inherit',
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.875rem'
      }
    })
  }
};

export default Component;
