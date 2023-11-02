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
          marginLeft: -10,
          marginTop: -1
        }
      },
      '& .SCFeedUpdatesWidget-button-load-more': {
        textTransform: 'capitalize'
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
