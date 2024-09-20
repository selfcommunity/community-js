const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCRelatedEventsWidget-content': {
        padding: `10px ${theme.spacing(2)} 12px`,

        '& .SCRelatedEventsWidget-header': {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: theme.spacing(2),

          '& .SCRelatedEventsWidget-avatar-wrapper': {
            flexDirection: 'row',
            alignItems: 'center',
            color: 'inherit',
            padding: 0,
            minWidth: 'auto',
            '& .SCRelatedEventsWidget-avatar': {
              width: theme.selfcommunity.user.avatar.sizeMedium,
              height: theme.selfcommunity.user.avatar.sizeMedium
            }
          },
          '& h4': {
            marginLeft: 7,
            lineHeight: '28px'
          }
        },

        '& .SCRelatedEventsWidget-event-wrapper': {
          gap: theme.spacing(2),

          '& .SCRelatedEventsWidget-event': {
            '& > div': {
              padding: '0 !important',

              '& > .SCBaseItem-content': {
                '& > .SCBaseItem-text': {
                  margin: 0
                }
              }
            }
          }
        }
      },

      '& .SCRelatedEventsWidget-actions': {
        padding: `0 ${theme.spacing(2)} 15px`,
        justifyContent: 'center',

        '& .SCSuggestedEventsWidget-actionButton': {
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCRelatedEventsWidget-content': {
        padding: `10px ${theme.spacing(2)} 12px`,

        '& .SCRelatedEventsWidget-user': {
          marginBottom: theme.spacing(2),

          '& > .SCBaseItem-content': {
            '& > .SCBaseItem-text': {
              margin: 0
            }
          },

          '& > .SCBaseItem-actions': {
            display: 'none'
          }
        },

        '& .SCRelatedEventsWidget-event-wrapper': {
          gap: theme.spacing(2),

          '& .SCRelatedEventsWidget-event': {
            '& > div': {
              padding: '0 !important',

              '& > .SCBaseItem-content': {
                '& > .SCBaseItem-text': {
                  margin: 0
                }
              }
            }
          }
        }
      },

      '& .SCRelatedEventsWidget-actions': {
        padding: `0 ${theme.spacing(2)} 15px`,
        justifyContent: 'center'
      }
    }),
    dialogRoot: ({ theme }) => ({
      '& .SCRelatedEventsWidget-infinite-scroll': {
        height: '400px',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        },

        '& .SCEvent-root': {
          width: '100%'
        }
      }
    })
  }
};

export default Component;
