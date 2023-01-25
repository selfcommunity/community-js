const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFeedObject-detail, & .SCCommentsFeedObject-root': {
        maxWidth: theme.breakpoints.values['sm']
      },
      '& .SCCommentsFeedObject-root': {
        padding: theme.spacing(),
        '& .SCCommentsObject-root h6': {
          paddingLeft: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
