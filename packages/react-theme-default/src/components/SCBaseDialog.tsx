const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& h2': {
        fontSize: '1.286rem',
        fontWeight: theme.typography.fontWeightBold,
        padding: theme.spacing(3),
        '& .MuiIconButton-root': {
          right: theme.spacing(3),
          top: theme.spacing(3),
          fontSize: '1rem'
        }
      },
      '& .MuiDialogContent-root': {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        '& .infinite-scroll-component': {
          ' > .': {
            marginBottom: theme.spacing(2.5)
          },
          '& .MuiList-root': {
            paddingTop: 0,
            paddingBottom: 0,
            '& .MuiListItem-root': {
              paddingLeft: 0,
              '& .SCBaseItemButton-root': {
                borderRadius: 0
              }
            }
          }
        }
      },
      '& .MuiDialogActions-spacing': {
        padding: theme.spacing(2, 3)
      }
    })
  }
};

export default Component;
