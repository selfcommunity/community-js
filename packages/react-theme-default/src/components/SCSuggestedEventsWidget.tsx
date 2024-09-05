const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCSuggestedEventsWidget-content': {
        padding: `15px 0 ${theme.spacing(2)} ${theme.spacing(2)}`,

        '& .SCSuggestedEventsWidget-title': {
          marginBottom: '11px'
        },

        '& .SCSuggestedEventsWidget-swiper': {
          position: 'relative',

          '& .swiper-wrapper': {
            paddingBottom: '1px',

            '& .SCSuggestedEventsWidget-swiper-slide': {
              width: '210px',
              height: 'auto',

              '& .SCSuggestedEventsWidget-event': {
                '& .SCEventInfoDetails-root': {
                  '& h5': {
                    fontSize: '1rem',
                    maxWidth: 200,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  },

                  '& .SCEventInfoDetails-icon-text-wrapper': {
                    '& .community-icons': {
                      fontSize: '0.9rem'
                    },

                    '& p': {
                      marginTop: 1,
                      fontSize: '0.74rem'
                    }
                  }
                }
              }
            }
          },

          '& .SCSuggestedEventsWidget-swiper-arrow': {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            paddingLeft: '10px!important',
            paddingRight: '10px!important',
            minWidth: 'auto',
            backgroundColor: theme.palette.grey[400]
          },

          '& .SCSuggestedEventsWidget-swiper-prev-arrow': {
            left: '5px'
          },

          '& .SCSuggestedEventsWidget-swiper-next-arrow': {
            right: '5px'
          }
        }
      },

      '& .SCSuggestedEventsWidget-actions': {
        padding: `0 ${theme.spacing()} ${theme.spacing()}`,
        justifyContent: 'center',

        '& .SCSuggestedEventsWidget-actionButton': {
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCSuggestedEventsWidget-content': {
        padding: `15px 0 ${theme.spacing(3)} ${theme.spacing(2)}`,

        '& .SCSuggestedEventsWidget-title': {
          marginBottom: '11px'
        },

        '& .SCSuggestedEventsWidget-swiper-slide': {
          width: '200px',
          height: 'auto'
        }
      },

      '& .SCSuggestedEventsWidget-actions': {
        padding: `0 ${theme.spacing()} ${theme.spacing()}`,
        justifyContent: 'center'
      }
    })
  }
};

export default Component;
