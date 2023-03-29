import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      [theme.breakpoints.up('sm')]: {
        height: theme.spacing(103.5),
        maxHeight: 'inherit'
      },
      '& .MuiCardContent-root': {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: theme.spacing(103.5),
        overflow: 'auto',
        '& .MuiList-root': {
          '& .Mui-selected': {
            backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
          },
          '&:last-child': {
            marginBottom: theme.spacing(2)
          },
          '& .MuiButtonBase-root, MuiListItemButton-root': {
            '&:hover': {borderRadius: 'inherit', backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity)}
          }
        }
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCPrivateMessageSnippets-root, MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .SCPrivateMessageSnippets-input': {
        '& .MuiInputBase-input, MuiFilledInput-input': {
          padding: theme.spacing(0)
        },
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
        '&:hover': {
          backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
        },
        height: theme.spacing(3.75),
        '& .SCPrivateMessageSnippets-icon': {
          marginRight: theme.spacing(1)
        }
      },
      '& .SCPrivateMessageSnippets-new-message-button': {
        color: `${theme.palette.primary.main} !important`,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        '&:hover': {
          borderWidth: '2px !important',
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        }
      }
    })
  }
};
export default Component;
