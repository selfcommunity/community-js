const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCCreateEventWidget-image': {
        height: '110px'
      },

      '& .SCCreateEventWidget-calendar': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.palette.common.white
      },

      '& .SCCreateEventWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} 0 !important`,

        '& .SCCreateEventWidget-title': {
          textAlign: 'center',
          marginBottom: theme.spacing(2)
        },

        '& .SCCreateEventWidget-spacing': {
          marginBottom: theme.spacing(2)
        }
      },

      '& .SCCreateEventWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(2)}`,
        justifyContent: 'center'
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCCreateEventWidget-calendar': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },

      '& .SCCreateEventWidget-content': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} 0 !important`,

        '& .SCCreateEventWidget-title': {
          textAlign: 'center'
        },

        '& .SCCreateEventWidget-spacing': {
          marginBottom: theme.spacing(2)
        }
      },

      '& .SCCreateEventWidget-actions': {
        padding: `0 ${theme.spacing(2)} ${theme.spacing(2)}`,
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
