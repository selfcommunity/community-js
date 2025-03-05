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
          },
          // '& .SCEditor-paragraph': {}
          '& > div:has(> a)': {
            borderRadius: '5px',
            padding: theme.spacing(1),
            background: theme.palette.grey[300]
          },
          '& > div:has(> a) > a:first-of-type': {
            textDecoration: 'none',
            color: 'inherit'
          }
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
        boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.2)'
      },
      '& .SCLessonObject-button': {
        alignSelf: 'center'
      }
    })
  }
};

export default Component;
