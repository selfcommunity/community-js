const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroups-skeleton-root ': {
        '& .MuiGrid-item': {
          paddingTop: 0
        }
      },
      '& .MuiGrid-container': {
        justifyContent: 'center'
      },
      '& .SCGroups-filters': {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2)
      },
      '& .SCGroups-search': {
        '& .MuiButtonBase-root': {
          minWidth: '30px',
          '& .MuiButton-endIcon': {
            margin: 0
          }
        }
      },
      '& .SCGroups-groups': {
        marginTop: theme.spacing(2),
        '& .SCGroups-item': {
          '& > div': {
            cursor: 'default',
            padding: theme.spacing(1)
          }
        }
      },
      '& .SCGroups-no-results': {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& h4': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: theme.typography.h4.fontSize
        },
        '& .MuiTypography-body1': {
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: theme.typography.body1.fontSize
        }
      },
      '& .SCGroups-end-message': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiButtonBase-root': {
          paddingLeft: theme.spacing(1),
          '&.Mui-selected, &:hover': {
            backgroundColor: 'transparent'
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCGroups-groups': {
        justifyContent: 'center',
        marginTop: theme.spacing(3),
        '& .SCGroup-skeleton-root': {
          padding: theme.spacing(1),
          width: 'auto'
        }
      }
    })
  }
};

export default Component;
