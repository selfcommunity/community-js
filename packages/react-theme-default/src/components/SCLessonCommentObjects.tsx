const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      [theme.breakpoints.up('sm')]: {
        height: '90%'
      },
      overflowY: 'auto',
      padding: theme.spacing(2),
      justifyContent: 'space-between',
      '& .SCCommentObjectReply-root': {
        backgroundColor: 'transparent',
        '& .SCEditor-actions': {
          left: theme.spacing(1),
          '& .SCCommentObjectReply-icon-reply': {
            marginLeft: 'auto'
          }
        },
        marginTop: theme.spacing(2),
        marginBottom: 0
      },
      '& .infinite-scroll-component__outerdiv': {
        overflowY: 'auto',
        '& .infinite-scroll-component': {
          '& .MuiList-root ': {
            padding: 0,
            '& .MuiListItem-root': {
              padding: 0
            }
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
