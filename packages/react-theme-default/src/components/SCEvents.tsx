const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCEvents-filters': {
        alignItems: 'center',
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(2),
        '& .SCEvents-search': {
          '& .MuiInputBase-root': {
            paddingRight: 0,
            '& .MuiButtonBase-root': {
              borderRadius: '0 5px 5px 0',
              height: '37px',
              '& .MuiButton-endIcon': {
                margin: 0
              }
            }
          }
        }
      },
      '& .SCEvents-events': {
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
          marginBottom: theme.spacing(7)
        },

        '& .SCEvents-item': {
          paddingTop: theme.spacing(2)
        },

        '& .SCEvents-item-skeleton': {
          paddingTop: theme.spacing(2)
        },
        '& .SCBaseItem-root': {
          display: 'flex',
          justifyContent: 'space-between'
        },
        '& .SCEvent-skeleton-preview-name': {
          marginTop: 6,
          marginBottom: 6
        },
        '& .SCEvent-skeleton-snippet .SCBaseItem-content': {
          maxWidth: '70%'
        }
      },
      '& .SCEvents-no-results': {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        '& .SCEvent-skeleton-root': {
          marginBottom: theme.spacing(2),
          minWidth: '50%',
          [theme.breakpoints.down('md')]: {
            width: '100%'
          }
        },
        '& .SCEvent-skeleton-snippet .SCBaseItem-content': {
          maxWidth: '70%'
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
      '& .SCEvents-skeleton-events': {
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        '& .SCEvents-skeleton-item': {
          paddingTop: theme.spacing(2)
        }
      }
    }),
    eventsChipRoot: ({theme, showFollowed, showPastEvents}: any) => ({
      height: theme.spacing(4.75),
      borderRadius: theme.spacing(0.5),
      color: showFollowed || showPastEvents ? theme.palette.common.white : theme.palette.text.primary,
      '& .MuiIcon-root': {
        fontSize: '1rem',
        color: theme.palette.common.white
      }
    })
  }
};

export default Component;
