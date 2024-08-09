const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCEvents-filters': {
        alignItems: 'center',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2)
      },
      '& .SCEvents-events': {
        marginTop: theme.spacing(2),
        '& .SCEvents-item': {},
        '& .SCEvent-skeleton-root': {
          padding: theme.spacing(0.5, 0, 0.5, 0)
        }
      },
      '& .SCEvents-no-results': {
        maxWidth: '50%',
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        '& .SCEvent-skeleton-root': {
          marginBottom: theme.spacing(2)
        },
        '& .MuiTypography-body1': {
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: '16px',
          whiteSpace: 'pre-line'
        }
      },
      '& .SCEvents-show-more': {
        paddingLeft: theme.spacing(1),
        '&.Mui-selected, &:hover': {
          backgroundColor: 'transparent'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCEvents-events': {
        justifyContent: 'center',
        marginTop: theme.spacing(3)
      }
    }),
    chipRoot: ({theme, selected}: any) => ({
      height: theme.spacing(4.75),
      borderRadius: theme.spacing(0.5),
      color: selected ? theme.palette.common.white : theme.palette.text.primary,
      '& .MuiIcon-root': {
        fontSize: '1rem',
        color: theme.palette.common.white
      }
    })
  }
};

export default Component;
