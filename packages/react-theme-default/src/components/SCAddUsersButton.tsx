const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '&.SCAddUsersButton-default-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.default)
      }
    }),
    dialogRoot: ({theme}) => ({
      '& .SCAddUsersButton-dialog-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },
      '& .MuiDialogActions-root': {
        marginTop: '36px'
      },

      '& .SCAddUsersButton-dialog-autocomplete-wrapper': {
        gap: '10px',

        '& .SCAddUsersButton-dialog-chip-wrapper': {
          flexDirection: 'row',
          gap: '5px',
          flexWrap: 'wrap'
        }
      }
    })
  }
};

export default Component;
