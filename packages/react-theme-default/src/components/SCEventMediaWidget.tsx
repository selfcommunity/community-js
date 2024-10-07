const Component = {
  styleOverrides: {
    root: ({ theme, showPadding }) => ({
      '& .SCEventMediaWidget-header': {
        padding: showPadding ? theme.spacing('10px', 2) : theme.spacing(2),

        '& .SCEventMediaWidget-input': {
          display: 'none'
        }
      },

      '& .SCEventMediaWidget-content': {
        padding: theme.spacing(2, 2),
        paddingBottom: 'unset',

        '& .SCEventMediaWidget-grid': {
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: 'repeat(3, 1fr)',

          '& > div': {
            position: 'relative',
            width: '100%',
            paddingBottom: '100%',
            backgroundSize: 'cover',
            cursor: 'pointer',

            '& > div:first-of-type': {
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(102, 102, 102, 0.2)',
              opacity: 0.8
            },

            '& > div:last-of-type': {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.common.white,

              '& > p': {
                fontSize: '200%'
              }
            }
          }
        }
      },

      '& .SCEventMediaWidget-actions': {
        padding: theme.spacing('10px', 2),
        justifyContent: 'center'
      }
    }),
    skeletonRoot: ({ theme }) => ({}),
    dialogRoot: ({ theme }) => ({
      '& .SCEventMediaWidget-grid': {
        display: 'grid',
        gap: '5px',
        gridTemplateColumns: 'repeat(3, 1fr)',

        '& > .SCEventMediaWidget-media-wrapper': {
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          backgroundSize: 'cover',

          '& > .SCEventMediaWidget-button-wrapper': {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '30px',
            backgroundColor: theme.palette.common.black,
            opacity: 0.6,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',

            '& > .SCEventMediaWidget-loading-button': {
              padding: 0,
              minWidth: '50px',

              '& > .MuiLoadingButton-loadingIndicatorCenter': {
                color: theme.palette.common.white
              }
            }
          }
        }
      }
    })
  }
};

export default Component;
