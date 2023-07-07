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
            '& .MuiInputBase-input, MuiFilledInput-input': {
              padding: theme.spacing(0.5, 1)
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
            backgroundColor: theme.palette.grey['A200']
          }
        },
        '& .MuiList-root': {
          flexGrow: 1,
          overflowY: 'auto',
          padding: theme.spacing(1),
          '& .Mui-selected': {
            backgroundColor: theme.palette.grey['A200']
          },
          '& .MuiButtonBase-root, MuiListItemButton-root': {
            '&:hover': {borderRadius: 'inherit', backgroundColor: theme.palette.grey['A200']}
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
