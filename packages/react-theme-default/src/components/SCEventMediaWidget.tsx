const Component = {
  styleOverrides: {
    root: ({ theme, showPadding }) => ({
      '& .SCEventMediaWidget-header': {
        padding: showPadding ? theme.spacing('10px', 2) : theme.spacing(2)
      },

      '& .SCEventMediaWidget-content': {
        padding: theme.spacing(2),

        '& .SCEventMediaWidget-grid': {
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: 'repeat(3, 1fr)',

          '& > .SCEventMediaWidget-media': {
            position: 'relative',
            width: '100%',
            paddingBottom: '100%',
            backgroundSize: 'cover',
            cursor: 'pointer',

            '& > .SCEventMediaWidget-media-layer': {
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(102, 102, 102, 0.2)',
              opacity: 0.8
            },

            '& > .SCEventMediaWidget-count-hidden-media-wrapper': {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.common.white,

              '& > .SCEventMediaWidget-count-hidden-media': {
                fontSize: '200%'
              }
            }
          }
        }
      },

      '& .SCEventMediaWidget-actions': {
        padding: theme.spacing(0, 2, '10px'),
        justifyContent: 'center'
      }
    }),
    skeletonRoot: ({ }) => ({
      '& .SCEventMediaWidget-grid': {
        display: 'grid',
        gap: '5px',
        gridTemplateColumns: 'repeat(3, 1fr)',

        '& > .SCEventMediaWidget-media': {
          paddingBottom: '100%'
        }
      }
    }),
    dialogRoot: ({ theme }) => ({
      '& .SCEventMediaWidget-grid': {
        display: 'grid',
        gap: '5px',
        gridTemplateColumns: 'repeat(3, 1fr)',

        '& > .SCEventMediaWidget-media': {
          paddingBottom: '100%'
        },

        '& > .SCEventMediaWidget-dialog-media-wrapper': {
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          backgroundSize: 'cover',

          '& > .SCEventMediaWidget-dialog-button-wrapper': {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '30px',
            backgroundColor: theme.palette.common.black,
            opacity: 0.6,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',

            '& > .SCEventMediaWidget-dialog-loading-button': {
              padding: 0,
              minWidth: '50px',

              '& > .MuiLoadingButton-loadingIndicatorCenter': {
                color: theme.palette.common.white
              }
            }
          }
        }
      }
    }),
    triggerRoot: ({ isSquare }) => ({
      padding: isSquare && 0,
      borderRadius: isSquare && 0,
      backgroundColor: isSquare && 'rgba(112, 112, 112, 0.04)',

      '&:hover': {
        backgroundColor: isSquare && 'rgba(0, 0, 0, 0.04)'
      },

      '& > .SCEventMediaWidget-trigger-content': {
        position: isSquare && 'relative',
        width: isSquare && '100%',
        padding: isSquare && '10px 60px',
        paddingBottom: isSquare && '100%',
        flexDirection: 'row',
        gap: '5px',
        alignItems: 'center',
        justifyContent: isSquare ? 'center' : 'flex-end',

        '& > .SCEventMediaWidget-trigger-icon': {
          position: isSquare && 'absolute',
          top: isSquare && '50%',
          transform: isSquare && 'translateY(-50%)',
          fontSize: 'inherit'
        }
      }
    })
  }
};

export default Component;
