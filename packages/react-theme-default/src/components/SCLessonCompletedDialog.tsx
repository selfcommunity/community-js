const Component = {
  styleOverrides: {
    root: () => ({
      '& .SCLessonCompletedDialog-wrapper': {
        alignItems: 'center',

        '& .SCLessonCompletedDialog-title': {
          marginTop: '60px',
          marginBottom: '27px'
        },

        '& .SCLessonCompletedDialog-description-pt1': {
          marginTop: '27px'
        },

        '& .SCLessonCompletedDialog-description-pt2': {
          marginTop: '11px',
          marginBottom: '53px'
        }
      }
    })
  }
};

export default Component;
