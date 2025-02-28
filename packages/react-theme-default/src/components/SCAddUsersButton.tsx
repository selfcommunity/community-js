const Component = {
  styleOverrides: {
    root: () => ({}),
    dialogRoot: () => ({
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
