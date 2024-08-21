const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      overflow: 'visible',
      '& .SCBaseItem-image': {
        '& .MuiAvatar-root': {
          width: 100,
          height: 60,
          '& img': {
            borderRadius: '5px'
          }
        }
      },
      '& .SCBaseItem-text': {
        fontSize: theme.typography.fontSize,
        '& .SCEvent-primary': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none'
          },
          '& p': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCEvent-secondary': {
          color: theme.palette.text.secondary
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      gap: '10%',
      '& .SCBaseItem-content': {
        flex: 0
      },
      '& .SCEvent-skeleton-image': {
        position: 'relative',
        '& .MuiSkeleton-root': {
          borderRadius: '5px'
        },
        '& .MuiIcon-root': {
          color: theme.palette.common.white,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      },
      '& .SCBaseItem-actions': {
        maxWidth: 'none !important'
      }
    })
  }
};

export default Component;
