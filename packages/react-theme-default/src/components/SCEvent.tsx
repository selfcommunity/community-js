const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      overflow: 'visible',
      '& .SCBaseItem-image': {
        '& .MuiAvatar-root': {
          width: 100,
          height: 60,
          '& img': {
            borderRadius: 0
          }
        }
      },
      '& .SCBaseItem-text': {
        fontSize: theme.typography.fontSize,
        '& .SCEvent-primary': {
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
      '& .SCEvent-skeleton-image': {
        position: 'relative',
        '& .MuiIcon-root': {
          color: theme.palette.common.white,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      }
    })
  }
};

export default Component;
