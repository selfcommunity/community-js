const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      borderRadius: theme.spacing(1.5),
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: theme.spacing(1),
      '& .SCPrivateMessageSnippetItem-time': {
        float: 'right',
        fontSize: theme.typography.fontWeightRegular
      },
      '& .MuiListItemButton-root': {
        [theme.breakpoints.up('sm')]: {
          '&.SCPrivateMessageSnippetItem-unread': {paddingRight: theme.spacing(7)},
          paddingRight: theme.spacing(4)
        },
        [theme.breakpoints.down('sm')]: {
          '&.SCPrivateMessageSnippetItem-unread': {paddingRight: theme.spacing(3)},
          paddingRight: theme.spacing(2)
        }
      },
      '& .MuiListItemText-primary': {
        '& .SCPrivateMessageSnippetItem-username': {
          fontWeight: theme.typography.fontWeightBold
        },
        '& .SCPrivateMessageSnippetItem-badge-label': {
          marginLeft: theme.spacing(0.5),
          borderRadius: 0,
          fontSize: '0.5rem'
        }
      },
      '& .MuiListItemText-secondary': {
        '& .MuiTypography-root': {
          display: 'inline-block',
          width: '80%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      },
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex',
        alignItems: 'center',
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
