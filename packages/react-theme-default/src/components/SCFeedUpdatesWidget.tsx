const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      '& div:last-child': {
        paddingBottom: theme.spacing(2)
      },
      '& .MuiCardContent-root': {
        ' > .MuiButton-sizeMedium': {
          marginLeft: 10
        }
      },
      '& .SCFeedUpdatesWidget-button-load-more': {
        textTransform: 'capitalize',
        marginLeft: 10
      }
    })
  }
};

export default Component;
