const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(1)
      },
      '& .SCLessonObject-content': {
        padding: `${theme.spacing(2)} !important`,
        '& .SCLessonObject-text': {
          '& > div:first-of-type': {
            img: {
              display: 'block',
              margin: '0 auto',
              width: 'auto !important',
              maxWidth: '100% !important',
              position: 'relative !important'
            },
            padding: '0 !important'
          },
          '& > div:has(> a)': {
            borderRadius: '5px',
            padding: theme.spacing(1),
            background: theme.palette.grey[300]
          },
          '& > div:has(> a) > a:first-of-type': {
            textDecoration: 'none',
            color: 'inherit'
          }
        },
        '& .SCLessonObject-medias-section': {
          display: 'flex',
          '& .SCLessonFilePreview-root': {
            marginBottom: theme.spacing(1)
          },
          '& .SCMediaLink-display-root': {
            marginBottom: theme.spacing(1),

            '& > div > div': {
              [theme.breakpoints.down('md')]: {
                height: '240px !important'
              }
            }
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
        [theme.breakpoints.down('md')]: {
          boxShadow: 'none'
        }
      },
      '& .SCLessonObject-button': {
        alignSelf: 'center'
      }
    })
  }
};

export default Component;
