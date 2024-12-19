const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    drawerRoot: ({theme}: any) => ({
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
          //width: theme.spacing(40)
          width: '300px'
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
        '& .MuiList-root': {
          '& .Mui-selected': {
            backgroundColor: theme.palette.grey[300]
          },
          '& .MuiButtonBase-root, MuiListItemButton-root': {
            '&:hover': {backgroundColor: theme.palette.grey[300]}
          }
        },
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
          padding: theme.spacing(0.5, 3, 0.5, 3),
          '& .MuiListItemText-primary': {
            fontWeight: theme.typography.fontWeightMedium
          }
        },
        '& .SCLessonComponent-item-icon': {
          minWidth: theme.spacing(4)
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
    }),
    appBarRoot: ({theme, open}: any) => ({
      boxShadow: 'none',
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      '& .MuiToolbar-root': {
        minHeight: '60px'
      },
      transition: theme.transitions.create(['margin', 'width'], {
        easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
        duration: open ? theme.transitions.duration : theme.transitions.duration.leavingScreen
      }),
      ...(open && {
        [theme.breakpoints.down('md')]: {marginRight: '100vw'},
        [theme.breakpoints.up('sm')]: {marginRight: '300px'},
        width: `calc(100% - 300px)`
      })
    })
  }
};

export default Component;
