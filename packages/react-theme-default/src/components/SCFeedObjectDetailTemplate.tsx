const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentsFeedObject-root': {
        padding: theme.spacing(2, 1),
        '& .SCCommentsObject-root h6': {
          paddingLeft: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
