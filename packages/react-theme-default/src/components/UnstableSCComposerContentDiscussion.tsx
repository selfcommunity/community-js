const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .UnstableSCComposerContentDiscussion-title': {
        paddingBottom: theme.spacing(2),
        '& .MuiInputBase-root': {
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          fontSize: '1.429rem',
          fontWeight: theme.typography.fontWeightBold,
          '& fieldset': {
            display: 'none'
          },
          '&.MuiInputBase-adornedEnd .MuiTypography-root': {
            alignSelf: 'end'
          },
          '&.Mui-error': {
            color: theme.palette.error.main
          }
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0
        }
      }
    })
  }
};

export default Component;
