const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      border: '0 none',
      marginBottom: theme.spacing(1),
      '& .SCBaseItem-image': {
        '& .SCCommentObjectReply-badge': {
          top: '25%',
          right: '5%',
          '& .SCCommentObjectReply-badge-icon': {
            width: theme.selfcommunity.user.avatar.sizeSmall,
            height: theme.selfcommunity.user.avatar.sizeSmall,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.background.paper}`
          }
        }
      },
      '& .SCBaseItem-content': {
        alignItems: 'flex-start',
        '& .SCBaseItem-text': {
          marginTop: 0,
          marginBottom: 0,
          '& .SCBaseItem-secondary': {
            overflow: 'visible'
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
