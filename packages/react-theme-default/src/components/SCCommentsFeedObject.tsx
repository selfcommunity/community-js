const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentObject-root': {
        '& > div': {
          background: 'transparent'
        }
      },
      '& .SCCommentObjectSkeleton-root': {
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
      '& .SCCommentsObjectSkeleton-root': {
        marginBottom: theme.spacing(0.5)
      },
      '& .SCCommentObjectReply-root': {
        '& .SCCommentObjectReply-comment': {
          marginBottom: theme.spacing(4)
        }
      }
    })
  }
};

export default Component;
