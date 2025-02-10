const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(2),
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& .SCLessonEditForm-form': {
        display: 'flex',
        flexDirection: 'column'
      },
      '& .MuiFormLabel-root': {
        fontWeight: 700,
        color: 'inherit',
        '& .Mui-focused': {color: 'inherit'}
      },
      '& .SCLessonEditForm-settings': {
        marginTop: theme.spacing(2)
      },
      '& .SCLessonEditForm-button': {
        alignSelf: 'center',
        marginBottom: theme.spacing(3)
      }
    })
  }
};

export default Component;
