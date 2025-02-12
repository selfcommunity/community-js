const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      '& .SCLessonObject-content': {
        padding: `${theme.spacing(2)} !important`,
        '& .SCLessonObject-text': {
          '& > div:first-of-type': {
            height: '240px',
            img: {
              height: '240px',
              objectFit: 'cover'
            },
            padding: '0 !important'
          }
          // '& .SCEditor-paragraph': {
          //   paddingRight: theme.spacing(2),
          //   paddingLeft: theme.spacing(2)
          // }
        }
      },
      '& .SCLessonObject-content-edit': {
        padding: '0 !important',
        '& .SCEditor-content': {
          paddingTop: 0,
          paddingBottom: 0
        }
      },
      '& .SCWidget-root': {
        marginBottom: theme.spacing(3),
        boxShadow: 'none'
      },
      '& .SCLessonObject-button': {
        alignSelf: 'center'
      }
    })
  }
};

export default Component;
