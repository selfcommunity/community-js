const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: theme.spacing(103.5),
      maxHeight: 'inherit',
      '& .MuiCardContent-root': {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: theme.spacing(103.5),
        overflow: 'auto',
        '& .MuiList-root': {
          '&:last-child': {
            marginBottom: theme.spacing(2)
          },
          '& .MuiButtonBase-root, MuiListItemButton-root': {
            '&:hover': {borderRadius: 'inherit'}
          }
        }
      },
      '& .MuiPaper-root, MuiCard-root, SCWidget-root, SCPrivateMessageSnippets-root, MuiCardContent-root': {
        padding: theme.spacing(2)
      },
      '& .Mui-selected': {
        background: theme.palette.action.selected
      },
      '& .SCPrivateMessageSnippets-input': {
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(3.75),
        '& .SCPrivateMessageSnippets-icon': {
          marginRight: theme.spacing(1)
        }
      },
      '& .SCPrivateMessageSnippets-new-message-button': {
        color: theme.palette.primary.main,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        '&:hover': {
          borderWidth: '2px !important',
          backgroundColor: `${theme.palette.action.hover} !important`
        }
      }
    })
  }
};
export default Component;
