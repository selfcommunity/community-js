import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      [theme.breakpoints.down('sm')]: {
        marginBottom: '56px'
      },

      '& .SCEditCourse-contrast-color': {
        color: getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5 ? theme.palette.common.white : undefined
      },

      '& .SCEditCourse-header': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(0.5),

        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(2)
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

        [theme.breakpoints.down('sm')]: {
          paddingLeft: '14px',
          paddingRight: '14px'
        },

        '& .SCEditCourse-lesson-title': {
          marginBottom: '20px',

          [theme.breakpoints.down('sm')]: {
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
          }
        },

        '& .SCEditCourse-status': {
          borderRadius: theme.spacing(1),

          '& .MuiButtonBase-root': {
            padding: 0,
            textDecoration: 'underline',

            '&:hover': {
              backgroundColor: 'unset',
              textDecoration: 'underline'
            }
          }
        },

        '& .SCEditCourse-lesson-empty-status': {
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: '5px'
        },

        '& .SCEditCourse-empty-status-button': {
          marginTop: '7px'
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
          backgroundColor: theme.palette.common.white,

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
          backgroundColor: theme.palette.common.white,

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

            '& .MuiTableCell-root': {
              textWrapMode: 'nowrap'
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

              '& .SCEditCourse-edit-mode-wrapper': {
                flexDirection: 'row',
                alignItems: 'center',
                gap: '5px',

                '& .SCEditCourse-edit-mode-save-button': {
                  minWidth: 'unset',
                  borderRadius: '5px',
                  padding: '8px'
                },

                '& .SCEditCourse-edit-mode-close-button': {
                  border: `1px solid ${theme.palette.action.active}`,
                  borderRadius: '5px',
                  padding: '8px'
                }
              },

              '& .SCEditCourse-actions-wrapper': {
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '14px',

                [theme.breakpoints.up('sm')]: {
                  gap: '22px'
                },

                '& .SCEditCourse-change-lesson-status-published-wrapper': {
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.primary.main,

                  '& .MuiIcon-root': {
                    color: theme.palette.common.white
                  }
                },

                '& .SCEditCourse-change-lesson-status-icon-draft': {
                  width: '20px',
                  height: '20px',
                  borderRadius: 9999,
                  backgroundColor: theme.palette.grey['600']
                }
              },

              '& .SCEditCourse-table-body-collapse-wrapper': {
                padding: 0,
                border: 0
              }
            }
          }
        },

        '& .SCEditCourse-users-status-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '5px',
          marginTop: '7px',
          marginBottom: theme.spacing(2)
        },

        '& .SCEditCourse-options-container': {
          border: `1px solid ${theme.palette.grey['300']}`,
          borderRadius: '5px',
          padding: '10px 0',
          backgroundColor: theme.palette.common.white,

          '& .SCEditCourse-options-wrapper': {
            gap: theme.spacing(5),
            maxWidth: '600px',
            margin: 'auto'
          },

          '& .SCEditCourse-options-divider': {
            marginTop: '21px',
            marginBottom: theme.spacing(3)
          },

          '& .SCEditCourse-options-button-wrapper': {
            alignItems: 'flex-end',
            maxWidth: '600px',
            margin: 'auto'
          }
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      '& .SCEditCourse-header': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing(0.5),

        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(2)
        }
      },

      '& .SCEditCourse-tab-list': {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(4),
        borderBottom: `1px solid ${theme.palette.grey['300']}`,
        padding: theme.spacing('12px 0'),
        marginBottom: '13px'
      },

      '& .SCEditCourse-lesson-title': {
        marginBottom: '20px',

        [theme.breakpoints.down('sm')]: {
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
        }
      },

      '& .SCEditCourse-lessons-sections-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '9px',
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: '5px',
        backgroundColor: theme.palette.common.white
      },

      '& .SCEditCourse-table-container': {
        width: 'auto',
        border: `1px solid ${theme.palette.grey[300]}`,
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        backgroundColor: theme.palette.common.white,

        '& .SCEditCourse-margin': {
          margin: 'auto'
        },

        '& .SCEditCourse-margin-left': {
          marginLeft: 'auto'
        },

        '& .SCEditCourse-actions-wrapper': {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '22px'
        }
      },

      '& .SCEditCourse-users-status-wrapper': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '7px',
        marginBottom: theme.spacing(2)
      },

      '& .SCEditCourse-options-container': {
        border: `1px solid ${theme.palette.grey['300']}`,
        borderRadius: '5px',
        paddingBottom: '10px',
        backgroundColor: theme.palette.common.white,

        '& .SCEditCourse-options-wrapper': {
          gap: theme.spacing(5),
          maxWidth: '600px',
          margin: 'auto'
        },

        '& .SCEditCourse-options-divider': {
          marginTop: '21px',
          marginBottom: theme.spacing(3)
        },

        '& .SCEditCourse-options-button-wrapper': {
          alignItems: 'flex-end',
          maxWidth: '600px',
          margin: 'auto'
        }
      }
    })
  }
};

export default Component;
