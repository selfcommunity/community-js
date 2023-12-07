const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      '& .SCFeed-left': {
        padding: 0,
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(1.25)
        },
        '& > div:first-of-type': {
          marginTop: 0
        },
        '& > .SCWidget-root, & > .SCCustomAdv-root': {
          maxWidth: 850,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      },
      '& .SCFeed-left-items': {
        '& > div': {
          paddingBottom: theme.spacing(2)
        }
      },
      '& .SCFeed-right': {
        padding: theme.spacing(1.25, 0),
        '& > .SCWidget-root': {
          marginBottom: theme.spacing(3)
        }
      },
      '& .SCFeed-start': {
        '& > .SCWidget-root': {
          padding: 0,
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCFeed-end': {
        '& > .SCWidget-root': {
          padding: 0,
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCFeed-end-message': {
        textAlign: 'center',
        '& > div': {
          padding: theme.spacing(2)
        }
      },
      '& .SCFeed-refresh': {
        textAlign: 'center'
      },
      '& .SCFeed-pagination-link': {
        display: 'none'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      '& .SCFeed-left': {
        padding: 0,
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(1.25)
        },
        '&:last-child': {
          paddingBottom: theme.spacing(4)
        },
        '& > .SCWidget-root': {
          marginBottom: theme.spacing(2)
        }
      },
      '& .SCFeed-right': {
        padding: theme.spacing(1.25, 0),
        '& .SCWidget-root': {
          marginBottom: theme.spacing(3)
        }
      }
    })
  }
};

export default Component;
