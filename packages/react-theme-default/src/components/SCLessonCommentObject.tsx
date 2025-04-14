const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      overflow: 'visible',
      width: '100%',
      backgroundColor: 'transparent',
      border: 0,
      '& .SCLessonCommentObject-comment': {
        backgroundColor: 'transparent',
        border: 0,
        paddingBottom: 0,
        overflow: 'visible',
        '& > div': {
          alignItems: 'flex-start'
        },
        '& .SCBaseItem-image': {
          marginRight: theme.spacing(0.5)
        },
        '& .SCBaseItem-text': {
          marginTop: theme.spacing(0.5)
        }
      },
      '& .SCBaseItem-image .MuiBadge-badge': {
        top: theme.spacing(1.5),
        marginRight: 0,
        '& .SCUserAvatar-badge-content': {
          width: theme.spacing(1.5),
          height: theme.spacing(1.5)
        }
      },
      '& .SCBullet-root, & .SCDateTimeAgo-root': {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(0.5)
      },
      '& .SCLessonCommentObject-content': {
        backgroundColor: 'transparent',
        overflowWrap: 'anywhere',
        position: 'relative',
        display: 'flex',
        padding: theme.spacing(0.5),
        border: 0,
        '& .MuiCardContent-root': {
          flexGrow: 1,
          padding: 0,
          '& > p:first-of-type': {
            paddingTop: 4
          }
        },
        '& .SCLessonCommentObject-text-content': {
          paddingTop: '0 !important',
          margin: 0,
          '& a': {
            color: theme.palette.text.secondary,
            textDecoration: 'underlined',
            '&:hover': {
              textDecoration: 'none'
            }
          },
          '& p': {
            margin: 0,
            marginBlockStart: '0.3em',
            marginBlockEnd: '0.3em'
          },
          '& img': {
            maxWidth: '100%'
          }
        },
        '& .SCLessonCommentObject-media-content': {
          marginBottom: theme.spacing(1)
        }
      },
      '& .SCLessonCommentObject-avatar': {
        top: theme.spacing(),
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCLessonCommentObject-author': {
        marginRight: theme.spacing(0.5),
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '& span': {
          fontWeight: '600'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      paddingBottom: `${theme.spacing(2)} !important`,
      overflow: 'visible',
      '& > div': {
        alignItems: 'flex-start'
      },
      '& .SCLessonCommentObject-primary-content': {
        marginLeft: theme.spacing(0.5),
        marginBottom: 0
      },
      '&.SCWidget-root': {
        backgroundColor: 'transparent',
        '& .SCBaseItem-content': {
          alignItems: 'self-start'
        },
        '& .SCBaseItem-image': {
          marginRight: theme.spacing(0.5)
        },
        '& .SCBaseItem-text': {
          backgroundColor: 'transparent',
          marginBottom: 0,
          '& > .SCWidget-root': {
            border: 0,
            backgroundColor: 'transparent',
            boxShadow: 'none'
          },
          '& .MuiCardContent-root': {
            padding: theme.spacing(0.5)
          }
        }
      }
    })
  }
};

export default Component;
