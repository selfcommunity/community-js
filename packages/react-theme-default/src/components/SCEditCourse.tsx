const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCEditCourse-header': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(0.5),

        [theme.breakpoints.down('md')]: {
          marginLeft: theme.spacing(2)
        }
      },

      '& .SCEditCourse-tab-list': {
        borderBottom: `1px solid ${theme.palette.grey['300']}`,

        '& .SCEditCourse-tab': {
          textTransform: 'inherit'
        },

        '& > .Mui-disabled': {
          opacity: 0.3
        },

        '& > .MuiTabs-scrollButtons': {
          display: 'inline-flex'
        }
      },

      '& .SCEditCourse-tab-panel': {
        padding: '13px 0 0',

        [theme.breakpoints.down('md')]: {
          marginLeft: '14px'
        },

        '& .SCEditCourse-lesson-title': {
          marginBottom: '20px',

          [theme.breakpoints.down('md')]: {
            display: 'none'
          }
        },

        '& .SCEditCourse-lesson-info-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing(1),

          '& .SCEditCourse-lesson-info': {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1)
          },

          '& .SCEditCourse-lesson-status': {
            borderRadius: theme.spacing(1)
          }
        },

        '& .SCEditCourse-empty-wrapper': {
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: '5px',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: theme.spacing(3),
          marginTop: '9px',

          '& .SCEditCourse-empty-box': {
            width: '130px',
            height: '130px',
            border: `2px solid ${theme.palette.grey[300]}`,
            borderRadius: '20px',
            marginBottom: '10px',

            '& .SCEditCourse-empty-rotated-box': {
              width: 'inherit',
              height: 'inherit',
              border: 'inherit',
              borderRadius: 'inherit',
              transform: 'rotate(-25deg)',
              alignItems: 'center',
              justifyContent: 'center',

              '& .SCEditCourse-empty-icon': {
                transform: 'rotate(25deg)'
              }
            }
          },

          '& .SCEditCourse-empty-button': {
            marginTop: '7px'
          },

          '& .SCEditCourse-lesson-status': {
            borderRadius: theme.spacing(1)
          }
        },

        '& .SCEditCourse-lessons-sections-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '9px',
          padding: theme.spacing(2),
          border: `1px solid ${theme.palette.grey[300]}`,
          borderBottom: 'unset',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',

          '& .SCEditCourse-lessons-sections': {
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',

            '& .SCEditCourse-circle': {
              width: '6px',
              height: '6px',
              borderRadius: 9999,
              backgroundColor: theme.palette.common.black
            }
          },

          '& .SCEditCourse-section-button': {
            alignItems: 'flex-start',

            '& .SCEditCourse-section-button-typography': {
              textTransform: 'inherit'
            }
          }
        },

        '& .SCEditCourse-table-container': {
          width: 'auto',
          border: `1px solid ${theme.palette.grey[300]}`,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',

          '& .SCEditCourse-table': {
            '& .SCEditCourse-cell-width': {
              width: '3%'
            },

            '& .SCEditCourse-cell-align-center': {
              textAlign: 'center'
            },

            '& .SCEditCourse-cell-align-right': {
              textAlign: 'right'
            },

            '& .SCEditCourse-cell-padding': {
              paddingRight: 0
            },

            '& .SCEditCourse-table-header': {
              '& .SCEditCourse-table-header-typography': {
                textTransform: 'uppercase'
              }
            },

            '& .SCEditCourse-table-body': {
              '& .SCEditCourse-table-body-icon-wrapper': {
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px'
              },

              '& .SCEditCourse-table-body-accordion': {
                backgroundColor: theme.palette.grey[200]
              },

              '& .SCEditCourse-actions-wrapper': {
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '14px',

                [theme.breakpoints.up('md')]: {
                  gap: '22px'
                }
              },

              '& .SCEditCourse-form-select': {
                color: theme.palette.common.white,
                backgroundColor: theme.palette.primary.main,

                '& .MuiIcon-root': {
                  color: theme.palette.common.white
                }
              },

              '& .SCEditCourse-table-body-collapse-wrapper': {
                padding: 0,
                border: 0
              }
            }
          }
        }
      }
    }),
    skeletonRoot: () => ({})
  }
};

export default Component;
