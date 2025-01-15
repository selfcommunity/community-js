const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.down('md')]: {
        width: '100vw',
        flexShrink: 0
      },
      [theme.breakpoints.up('sm')]: {
        width: '300px'
      },
      '& h4': {
        fontWeight: theme.typography.fontWeightMedium
      },
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '300px'
        },
        backgroundColor: theme.palette.grey[200]
      },
      '& .SCLessonDrawer-header': {
        minHeight: theme.mixins.toolbar.minHeight,
        padding: theme.spacing(1, 1, 1, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCLessonDrawer-header-edit': {
        justifyContent: 'center',
        gap: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          justifyContent: 'space-between'
        }
      },
      '& .SCLessonDrawer-content': {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        '& .SCCommentsObject-root': {
          backgroundColor: 'transparent',
          '& .SCCommentObject-root, & .SCCommentObject-comment, & .SCCommentObject-content': {
            backgroundColor: 'transparent',
            border: 0
          },
          '& .SCBaseItem-image': {
            marginRight: 0
          },
          '& .SCBaseItem-text': {
            '& .SCCommentObject-author': {
              marginRight: theme.spacing(1)
            },
            '& .SCBullet-root, & .SCDateTimeAgo-root': {
              color: theme.palette.text.secondary
            }
          },
          '& .SCCommentObject-text-content': {
            paddingTop: 0
          }
        }
      },
      '& .SCCommentObjectReply-root': {
        backgroundColor: 'transparent',
        '& .SCEditor-actions': {
          left: theme.spacing(1),
          '& .SCCommentObjectReply-icon-reply': {
            marginLeft: 'auto'
          }
        },
        '& .SCBaseItem-content': {
          padding: theme.spacing(0, 2, 1, 2)
        }
      }
    })
  }
};

export default Component;
