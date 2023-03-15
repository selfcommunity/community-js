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
        }
      },
      '& .SCCommentObject-nested-comments': {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 25,
        '& ul.MuiList-root': {
          paddingTop: 0,
          paddingBottom: 0,
          width: '100%',
          '& li.MuiListItem-root': {
            paddingTop: 5
          }
        },
        [theme.breakpoints.up('sm')]: {
          paddingLeft: 55
        }
      },
      '& .SCCommentObject-content': {
        position: 'relative',
        display: 'flex',
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius * 0.5,
        borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        '& .MuiCardContent-root': {
          flexGrow: 1,
          padding: 0
        },
        '& .SCCommentObject-text-content': {
          margin: 0,
          '& a': {
            color: theme.palette.text.primary
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
      '& .SCCommentObject-avatar': {
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
        alignItems: 'center',
        color: theme.palette.primary.main,
        marginTop: 0,
        '& .SCCommentObject-activity-at': {
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& .SCCommentObject-vote': {
          color: 'inherit',
          padding: theme.spacing(1),
          fontSize: '1.571rem',
          minWidth: 0,
          borderRadius: '50%'
        },
        '& .SCCommentObject-reaction': {
          color: 'inherit',
          padding: theme.spacing(1),
          fontSize: '1.571rem',
          minWidth: 0,
          borderRadius: '50%',
          '& img': {
            width: '1em',
            height: '1em'
          }
        },
        '& .SCCommentObject-reply': {
          color: 'inherit',
          textDecorationStyle: 'solid',
          fontSize: '0.857rem',
          padding: theme.spacing(1),
          textTransform: 'capitalize'
        },
        '& .SCCommentObjectVotes-root .SCCommentObjectVotes-btnViewVotes': {
          color: 'inherit',
          padding: theme.spacing(1),
          marginTop: theme.spacing(-2.5),
          fontSize: '1.571rem'
        }
      }
    })
  }
};

export default Component;
