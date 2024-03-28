const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCGroups-groups': {
        marginTop: theme.spacing(3),
        '& .SCGroups-item': {
          padding: theme.spacing(2),
          width: 'auto',
          '& > div': {
            cursor: 'default',
            padding: theme.spacing(1)
          }
        }
      },
      '& .SCGroups-no-results': {
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
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCGroups-groups': {
        marginTop: theme.spacing(3),
        '& .SCGroup-skeleton-root': {
          padding: theme.spacing(1.5),
          width: 'auto'
        }
      }
    })
  }
};

export default Component;
