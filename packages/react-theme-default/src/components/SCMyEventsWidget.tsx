const Component = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .SCMyEventsWidget-title-wrapper': {
        padding: `12px ${theme.spacing(2)}`
      },

      '& .SCMyEventsWidget-image-wrapper': {
        position: 'relative',

        '& .SCMyEventsWidget-image': {
          height: '170px'
        }
      },

      '& .SCMyEventsWidget-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,

        '& .SCMyEventsWidget-user': {
          marginTop: '14px',

          '& .SCBaseItemButton-text': {
            margin: 0
          }
        },

        '& .SCMyEventsWidget-name-wrapper': {
          textDecoration: 'none',
          color: 'inherit',

          '& .SCMyEventsWidget-name': {
            marginBottom: '10px'
          }
        },

        '& .SCMyEventsWidget-first-divider': {
          marginTop: '18px',
          marginBottom: theme.spacing(2)
        },

        '& .SCMyEventsWidget-second-divider': {
          marginTop: theme.spacing(2),
          marginBottom: '18px'
        }
      },

      '& .SCMyEventsWidget-actions': {
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: theme.spacing(3),

        '& .SCMyEventsWidget-arrows': {
          width: '24px',
          height: '24px',
          color: theme.palette.primary.main
        },

        '& .SCMyEventsWidget-action-button': {
          color: theme.palette.primary.main,
          textDecoration: 'none'
        }
      }
    }),
    skeletonRoot: ({ theme }) => ({
      '& .SCMyEventsWidget-calendar': {
        position: 'absolute',
        bottom: '-36px',
        left: '24px',
        boxShadow: '0px 3px 8px #00000040'
      },

      '& .SCMyEventsWidget-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,

        '& .SCMyEventsWidget-first-divider': {
          marginTop: '18px',
          marginBottom: theme.spacing(2)
        },

        '& .SCMyEventsWidget-second-divider': {
          marginTop: theme.spacing(2),
          marginBottom: '18px'
        }
      },

      '& .SCMyEventsWidget-actions': {
        height: '40px',
        padding: `0 ${theme.spacing(3)} 18px`,
        justifyContent: 'center',
        gap: theme.spacing(3)
      }
    })
  }
};

export default Component;
