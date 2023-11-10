const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .SCCommentsFeedObject-no-comments': {
        padding: theme.spacing(),
        paddingLeft: 0
      },
      '& .SCCommentsFeedObject-comment-not-found': {
        padding: theme.spacing()
      },
      '& .SCCommentObject-root': {
        '& > div': {
          background: 'transparent'
        }
      },
      '& .SCCommentObject-skeleton-root': {
        background: 'transparent',
        boxShadow: 'none',
        border: 0,
        margin: theme.spacing(0.5, 0),
        '& .SCBaseItem-text': {
          '& .SCWidget-root': {
            '& .MuiCardContent-root': {
              padding: theme.spacing(2)
            }
          }
        }
      },
      '& .SCCommentsObject-skeleton-root': {
        marginBottom: theme.spacing(0.5)
      },
      '& .SCCommentObjectReply-root': {
        background: 'transparent',
        '& .SCCommentObjectReply-comment': {
          marginBottom: theme.spacing(4)
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
