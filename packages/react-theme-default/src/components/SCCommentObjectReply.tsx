const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      border: '0 none',
      marginBottom: theme.spacing(1),
      '& .SCBaseItem-content': {
        alignItems: 'flex-start',
        '& .SCBaseItem-text': {
          marginTop: 0,
          marginBottom: 0,
          '& .SCBaseItem-secondary': {
            overflow: 'visible'
          }
        },
        '& .SCBaseItem-image .MuiBadge-badge': {
          top: theme.spacing(1.25)
        }
      },
      '& .SCCommentObjectReply-comment': {
        overflow: 'visible',
        borderRadius: theme.shape.borderRadius * 0.5
      },
      '& .SCCommentObjectReply-actions': {
        marginLeft: theme.spacing(),
        paddingBottom: theme.spacing()
      }
    })
  }
};

export default Component;
