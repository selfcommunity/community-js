const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      position: 'relative',
      height: '90%',
      '& .SCCommentObjectReply-root': {
        position: 'absolute',
        backgroundColor: 'transparent',
        '& .SCEditor-actions': {
          left: theme.spacing(1),
          '& .SCCommentObjectReply-icon-reply': {
            marginLeft: 'auto'
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      width: '100%',
      backgroundColor: 'transparent'
    })
  }
};

export default Component;
