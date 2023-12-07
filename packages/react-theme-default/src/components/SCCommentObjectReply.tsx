const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      border: '0 none',
      marginBottom: theme.spacing(1),
      overflow: 'visible',
      '& .SCBaseItem-content': {
        alignItems: 'flex-start',
        '& .SCBaseItem-text': {
          marginTop: 0,
          marginBottom: 0,
          '& .SCBaseItem-secondary': {
            overflow: 'visible'
          }
        },
        '& .SCBaseItem-image': {
          marginTop: theme.spacing(0.2),
          '& .MuiBadge-badge': {
            top: theme.spacing(1.25)
          },
          '& .SCCommentObjectReply-avatar': {
            width: theme.selfcommunity.user.avatar.sizeMedium,
            height: theme.selfcommunity.user.avatar.sizeMedium
          }
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
