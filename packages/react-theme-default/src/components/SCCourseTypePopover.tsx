const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(1),

      '& .SCCourseTypePopover-button': {
        padding: 0,
        textDecoration: 'underline',

        '&:hover': {
          backgroundColor: 'unset',
          textDecoration: 'underline'
        }
      }
    })
  }
};

export default Component;
