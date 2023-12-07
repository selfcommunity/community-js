const Component = {
  styleOverrides: {
    root: () => ({
      '& .SCContributionActionsMenu-visibility-icons': {
        color: 'red',
        '& > span: nth-of-type(2)': {
          position: 'relative',
          top: 1
        }
      }
    })
  }
};

export default Component;
