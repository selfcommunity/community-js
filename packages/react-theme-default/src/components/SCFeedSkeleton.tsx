const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: theme.spacing(2),
      maxWidth: theme.breakpoints.values['lg'],
      '& .SCFeedSkeleton-left': {
        padding: theme.spacing(1.25),
        '&:last-child': {
          paddingBottom: theme.spacing(4)
        }
      },
      '& .SCFeedSkeleton-right': {
        padding: theme.spacing(1.25, 0),
        '& .SCWidget-root': {
          marginBottom: theme.spacing(3)
        }
      },
      '& .SCFeedSkeleton-end': {
        padding: 0,
        marginBottom: theme.spacing(3),
        '& > div': {
          padding: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
