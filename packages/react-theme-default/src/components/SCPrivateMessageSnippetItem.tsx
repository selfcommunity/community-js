const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.spacing(1.5),
      padding: `${theme.spacing(0)}!important`,
      '& .SCPrivateMessageSnippetItem-time': {
        float: 'right',
        fontSize: theme.typography.fontWeightRegular
      },
      '& .MuiListItemText-primary': {
        '& .SCPrivateMessageSnippetItem-username': {
          fontWeight: theme.typography.fontWeightBold
        },
        '& .SCPrivateMessageSnippetItem-badge-label': {
          marginLeft: theme.spacing(1),
          borderRadius: 0,
          fontSize: '0.5rem'
        }
      },
      '& .MuiListItemText-secondary': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .MuiTypography-root': {
          display: 'inline-block',
          width: '80%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      },
      '& .MuiListItemSecondaryAction-root': {
        position: 'absolute',
        top: theme.spacing(3),
        right: theme.spacing(0.5),
        '& .MuiButtonBase-root': {
          fontSize: '1rem'
        }
      }
    })
  }
};

export default Component;
