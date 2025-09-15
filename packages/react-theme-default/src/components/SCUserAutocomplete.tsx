const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCUserAutocomplete-info': {
        marginTop: theme.spacing(3),
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
          alignItems: 'center'
        },
        '& .MuiIcon-root': {
          marginRight: theme.spacing(0.5)
        }
      }
    }),
    autocompleteRoot: ({theme}: any) => ({})
  }
};

export default Component;
