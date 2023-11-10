const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentsFeedObject-root': {
        padding: theme.spacing(2, 1),
        '& .SCCommentsObject-root h6': {
          paddingLeft: theme.spacing(2)
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: theme.spacing(2),
      '& .SCCommentsObject-skeleton-root': {
        '& .SCWidget-root': {
          marginBottom: '0px !important'
        }
      },
      '& .SCCommentObject-skeleton-root': {
        background: 'transparent',
        boxShadow: 'none',
        border: 0,
        paddingLeft: '0px !important',
        '& .SCCommentObject-skeleton-root': {
          marginBottom: '0px !important'
        }
      }
    })
  }
};

export default Component;
