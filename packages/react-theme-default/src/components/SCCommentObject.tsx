import { alpha } from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentObject-content': {
        padding: theme.spacing(),
        borderRadius: theme.shape.borderRadius * 0.5,
        borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        '& .SCCommentObject-text-content': {
          margin: 0,
          '& p': {
            margin: 0
          }
        }
      },
      '& .SCCommentObject-comment-sub-section': {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(1),
        '& .SCCommentObject-activity-at': {
          '&:hover': {
            color: 'inherit',
            textDecoration: 'underline'
          }
        },
        '& .SCCommentObject-vote': {
          padding: theme.spacing(1),
          fontSize: '1.571rem'
        },
        '& .SCCommentObject-reply': {
          textDecorationStyle: 'solid',
          fontSize: '0.857rem',
          padding: theme.spacing(1)
        },
        '& .SCCommentObjectVotes-root .SCCommentObjectVotes-btnViewVotes': {
          padding: theme.spacing(1),
          marginTop: theme.spacing(-2.5),
          fontSize: '1.571rem'
        }
      }
    })
  }
};

export default Component;
