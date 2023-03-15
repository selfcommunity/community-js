import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentNotification-username': {
        fontWeight: theme.typography.fontWeightBold,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCCommentNotification-vote-button': {
        color: 'inherit',
        padding: theme.spacing(1),
        fontSize: '1.143rem',
        minWidth: 0,
        borderRadius: '50%'
      },
      '& .SCCommentNotification-contribution-text': {
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    })
  }
};

export default Component;
