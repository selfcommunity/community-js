import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100%',
      width: '100%',
      '& .MuiCardContent-root': {
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${theme.spacing(4)})`,
        padding: theme.spacing(2),
        '& .SCPrivateMessageSnippets-search-bar': {
          padding: theme.spacing(1),
          '& .SCPrivateMessageSnippets-input': {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
            '&:hover': {
              backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
            },
            '& .MuiInputBase-input, MuiFilledInput-input': {
              padding: 0
            },
            '& .SCPrivateMessageSnippets-icon': {
              marginRight: theme.spacing(1)
            }
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
        },
        '& .MuiList-root': {
          flexGrow: 1,
          overflowY: 'auto',
          padding: theme.spacing(1),
          '& .Mui-selected': {
            backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
          },
          '& .MuiButtonBase-root, MuiListItemButton-root': {
            '&:hover': {borderRadius: 'inherit', backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity)}
          }
        }
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCPrivateMessageSnippets-root, MuiCardContent-root': {
        padding: theme.spacing(2)
      }
    })
  }
};
export default Component;
