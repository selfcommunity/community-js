const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      minWidth: 300,
      [theme.breakpoints.up(500)]: {
        minWidth: 500
      },
      '& .MuiDialogContent-root': {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.only('xs')]: {
          padding: 0
        },
        '& .infinite-scroll-component__outerdiv': {
          height: '100%',
          '& .infinite-scroll-component': {
            paddingRight: 10,
            ' > .': {
              marginBottom: theme.spacing(2.5)
            },
            '& .MuiList-root': {
              paddingTop: 0,
              paddingBottom: 0,
              '& .MuiListItem-root': {
                paddingLeft: 0,
                paddingRight: 0,
                '& .SCBaseItemButton-root': {
                  borderRadius: 0
                }
              }
            },
            '& .SCFeedObjectSkeleton-snippet': {
              marginLeft: theme.spacing(-2)
            }
          }
        }
      },
      '& [class*="-end-message"]': {
        padding: theme.spacing(3, 2),
        fontWeight: theme.typography.fontWeightBold,
        textAlign: 'center'
      },
      '& .MuiDialogActions-spacing': {
        padding: theme.spacing(2, 3)
      }
    }),
    titleRoot: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'start',
      justifyContent: 'flex-end',
      fontSize: '1.286rem',
      fontWeight: theme.typography.fontWeightBold,
      padding: theme.spacing(2, 3),
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      '& .MuiIconButton-root': {
        fontSize: '1rem',
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
          marginRight: -6
        }
      }
    })
  }
};

export default Component;
