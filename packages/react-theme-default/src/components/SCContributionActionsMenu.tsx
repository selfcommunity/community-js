const Component = {
  styleOverrides: {
    root: () => ({
      '& .SCContributionActionsMenu-visibility-badge': {
        color: 'red',
        marginTop: -2,
        marginBottom: 5,
        '& > span': {
          padding: 12,
          fontSize: 12
        }
      }
    })
  }
};

export default Component;
