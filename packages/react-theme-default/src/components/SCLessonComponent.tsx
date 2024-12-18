const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLessonComponent-info': {
        marginTop: theme.spacing(2)
      }
    }),
    drawerRoot: ({theme}: any) => ({
      '& h4': {
        fontWeight: theme.typography.fontWeightMedium
      },
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(40)
        },
        backgroundColor: theme.palette.grey[200]
      },
      '& .SCLessonComponent-drawer-header': {
        minHeight: theme.mixins.toolbar.minHeight,
        padding: theme.spacing(1, 1, 1, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCLessonComponent-drawer-header-edit': {
        justifyContent: 'center',
        gap: theme.spacing(2)
      },
      '& .SCLessonComponent-drawer-content': {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        '& .MuiFormLabel-root': {
          fontWeight: 700,
          color: 'inherit'
        },
        '& .SCLessonComponent-settings': {
          marginTop: theme.spacing(2)
        },
        '& .SCLessonComponent-list-item': {
          padding: 0,
          '&:hover, &:focus, &:active': {
            backgroundColor: 'transparent'
          }
        },
        '& .SCLessonComponent-list-item-icon': {
          minWidth: theme.spacing(3),
          color: theme.palette.text.secondary
        },
        '& .SCLessonComponent-item': {
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
          '& .MuiListItemText-primary': {
            fontWeight: theme.typography.fontWeightMedium
          }
        },
        '& .SCLessonComponent-item-icon': {
          minWidth: theme.spacing(4),
          justifyContent: 'center'
        },
        '& .SCLessonComponent-icon-complete': {
          color: theme.palette.success.main
        },
        '& .SCLessonComponent-icon-incomplete': {
          color: theme.palette.grey[300]
        },
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
        },
        '& .SCCommentObjectReply-root': {
          backgroundColor: 'transparent',
          '& .SCEditor-actions': {
            left: theme.spacing(1),
            '& .SCCommentObjectReply-icon-reply': {
              marginLeft: 'auto'
            }
          }
        }
      }
    })
  }
};

export default Component;
