const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      '& .SCLessonObject-content': {
        padding: '0 !important',
        '& .SCLessonObject-text': {
          '& > div:first-of-type': {
            height: '240px',
            img: {
              height: '240px',
              objectFit: 'cover'
            },
            padding: '0 !important'
          }
        }
      },
      '& .SCLessonObject-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& .SCWidget-root': {
        marginBottom: theme.spacing(3)
      },
      '& .SCLessonObject-button': {
        alignSelf: 'center'
      }
    })
  }
};

export default Component;
