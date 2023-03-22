const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      '& .SCFeedSkeleton-left': {
        padding: 0,
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(1.25)
        },
        '&:last-child': {
          paddingBottom: theme.spacing(4)
        },
        '& > .SCWidget-root': {
          marginBottom: theme.spacing(2)
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
