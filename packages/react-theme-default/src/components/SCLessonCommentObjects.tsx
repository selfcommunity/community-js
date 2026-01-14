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
      padding: theme.spacing(2, 2, 3, 2),
      justifyContent: 'space-between',
      '& .SCCommentObjectReply-root': {
        backgroundColor: 'transparent',
        '& .SCEditor-root': {
          paddingTop: theme.spacing(2)
        },
        '& .SCEditor-content': {
          minHeight: '50px'
        },
        '& .SCEditor-actions': {
          left: theme.spacing(1),
          '& .SCCommentObjectReply-icon-reply': {
            marginLeft: 'auto'
          }
        },
        marginTop: 'auto',
        marginBottom: 0
      },
      '& .infinite-scroll-component__outerdiv': {
        overflowY: 'auto',
        marginBottom: theme.spacing(2),
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
      backgroundColor: 'transparent',
      padding: theme.spacing(2, 0, 0, 2)
    })
  }
};

export default Component;
