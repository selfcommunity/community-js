const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiFormLabel-root': {
        fontWeight: 700,
        color: 'inherit'
      },
      '& .SCLessonEditForm-settings': {
        marginTop: theme.spacing(2)
      }
    })
  }
};

export default Component;
