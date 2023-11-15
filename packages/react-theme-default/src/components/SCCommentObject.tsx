import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      overflow: 'visible',
      width: '100%',
      '& .SCCommentObject-comment': {
        paddingBottom: 0,
        overflow: 'visible',
        '& > div': {
          alignItems: 'flex-start'
        },
        '& .SCBaseItem-image .MuiBadge-badge': {
          top: theme.spacing(1.5)
        },
        '& .SCBaseItem-text': {
          marginBottom: 0,
          marginTop: theme.spacing(0.2)
        }
      },
      '& .SCCommentObject-nested-comments': {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: theme.spacing(2),
        '& ul.MuiList-root': {
          paddingTop: 0,
          paddingBottom: 0,
          width: '100%',
          '& li.MuiListItem-root': {
            paddingTop: 5
          }
        },
        '& .SCCommentObject-reply-root .SCEditor-root': {
          padding: '6px'
        },
        [theme.breakpoints.up('sm')]: {
          paddingLeft: theme.spacing(6)
        }
      },
      '& .SCCommentObject-content': {
        overflowWrap: 'anywhere',
        position: 'relative',
        display: 'flex',
        padding: `6px`,
        borderRadius: theme.shape.borderRadius * 0.5,
        borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        '& .MuiCardContent-root': {
          flexGrow: 1,
          padding: 0,
          '& > p:first-of-type': {
            paddingTop: 4
          }
        },
        '& .SCCommentObject-text-content': {
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
        }
      },
      '& .SCCommentObject-show-more-content': {
        color: theme.palette.text.secondary,
        textDecoration: 'underlined',
        '&:hover': {
          textDecoration: 'none'
        }
      },
      '& .SCCommentObject-avatar, & .SCCommentObject-reply-avatar': {
        top: theme.spacing(),
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCCommentObject-author': {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '& span': {
          fontWeight: '600'
        }
      },
      '& .SCCommentObject-comment-actions-menu': {
        alignItems: 'flexStart'
      },
      '& .SCCommentObject-deleted': {
        opacity: 0.3
      },
      '& .SCCommentObject-content-sub-section': {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: theme.palette.text.secondary
      },
      '& .SCCommentObject-comment-sub-section': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        color: theme.palette.primary.main,
        marginTop: 0,
        position: 'relative',
        '& > *': {
          marginRight: theme.spacing(1)
        },
        '& .SCCommentObject-activity-at': {
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& .SCCommentObject-reply': {
          color: 'inherit',
          textDecorationStyle: 'solid',
          fontSize: '0.857rem',
          padding: theme.spacing(1),
          textTransform: 'capitalize'
        },
        '& .SCBullet-root': {
          display: 'none'
        },
        [theme.breakpoints.up('sm')]: {
          '& > *': {
            marginRight: 0
          },
          '& .SCCommentObject-vote-audience': {
            position: 'absolute',
            right: 0,
            top: 0
          },
          '& .SCBullet-root': {
            display: 'inline'
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      paddingBottom: theme.spacing(),
      overflow: 'visible',
      '& > div': {
        alignItems: 'flex-start'
      },
      '& .SCCommentObject-avatar': {
        top: theme.spacing()
      },
      '& .SCCommentObject-primary-content': {
        marginBottom: theme.spacing()
      },
      '&.SCWidget-root': {
        '& .SCBaseItem-text': {
          marginBottom: 0,
          '& > .SCWidget-root': {
            borderRadius: theme.shape.borderRadius * 0.5,
            borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          },
          '& .MuiCardContent-root': {
            padding: theme.spacing(1)
          }
        }
      }
    }),
    replyRoot: ({theme}: any) => ({
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
          '& .SCCommentObject-reply-avatar': {
            width: theme.selfcommunity.user.avatar.sizeMedium,
            height: theme.selfcommunity.user.avatar.sizeMedium
          }
        }
      },
      '& .SCCommentObject-reply-comment': {
        overflow: 'visible',
        borderRadius: theme.shape.borderRadius * 0.5
      },
      '& .SCCommentObject-reply-actions': {
        marginLeft: theme.spacing(),
        paddingBottom: theme.spacing()
      }
    })
  }
};

export default Component;
