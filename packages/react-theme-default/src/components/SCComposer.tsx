import {alpha} from '@mui/system';
import {hexToRgb} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => {
      let mediaActionBackground = theme.palette.getContrastText(theme.palette.primary.main);
      if (mediaActionBackground.startsWith('#')) {
        mediaActionBackground = hexToRgb(mediaActionBackground).replace(')', ', .5)');
      }
      return {
        '& .SCComposer-title': {
          borderBottom: `1px solid ${theme.palette.grey[400]}`,
          padding: theme.spacing(0, 0, 2, 0),
          lineHeight: 1,
          fontSize: '1.143rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& .SCComposer-types .MuiInputBase-input': {
            fontWeight: theme.typography.fontWeightBold,
            fontSize: '1.286rem',
            minHeight: 'auto'
          },
          '& > div': {
            flex: 1,
            textAlign: 'center'
          },
          '& > div:first-of-type': {
            textAlign: 'left'
          },
          '& > div:last-of-type': {
            textAlign: 'right',
            display: 'block'
          }
        },
        '& .SCComposer-types': {
          flexDirection: 'row',
          alignItems: 'center'
        },
        '& .SCComposer-avatar': {
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium,
          display: 'inline-block'
        },
        '& .SCComposer-content': {
          position: 'relative',
          overflowY: 'visible',
          padding: theme.spacing(3, 0),
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '& .SCComposer-editor': {
            flexGrow: 1,
            padding: 0,
            fontSize: '1rem',
            '& .SCEditor-placeholder': {
              top: 0,
              left: 0
            },
            '& .SCEditor-actions': {
              bottom: theme.spacing(4),
              padding: theme.spacing(3, 0, 0, 0),
              '& > p.MuiTypography-alignLeft > .MuiIconButton-root': {
                marginLeft: theme.spacing(0.3),
                marginRight: theme.spacing(0.3),
                '&:first-of-type': {
                  marginLeft: 0
                },
                '&:last-child': {
                  marginRight: 0
                }
              },
              '& > p.MuiTypography-alignRight > .MuiIconButton-root': {
                marginRight: theme.spacing(1.5)
              },
              '& .MuiIconButton-sizeMedium': {
                fontSize: '1.429rem'
              }
            },
            '&.SCEditor-toolbar': {
              '& .SCEditor-placeholder': {
                top: theme.spacing(6),
                left: 0
              },
              '& .SCEditor-actions': {
                bottom: theme.spacing(2)
              }
            }
          },
          '& .SCComposer-medias, & .SCComposer-audience, & .SCComposer-block': {
            margin: theme.spacing(1, 0),
            padding: 0
          },
          '& .SCComposer-medias': {
            '& .SCComposer-mediasActions': {
              position: 'relative',
              borderTop: `1px solid ${theme.palette.grey[400]}`,
              backgroundColor: theme.palette.background.paper,
              padding: theme.spacing(1, 0),
              '& .SCComposer-mediasActionsTitle': {
                fontSize: '1.143rem'
              }
            }
          }
        },
        '& .SCComposer-mediaContent, & .SCComposer-audienceContent, & .SCComposer-locationContent': {
          minHeight: 300
        },
        '& .SCComposer-audienceContent': {
          maxWidth: 400,
          margin: theme.spacing(0, 'auto'),
          '& .MuiTabs-root': {
            margin: theme.spacing(0),
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
              '& .MuiTab-root': {
                minHeight: theme.spacing(6),
                flexDirection: 'row',
                '& .MuiTab-iconWrapper': {
                  marginRight: theme.spacing(1),
                  fontSize: '1.429rem'
                }
              }
            }
          },
          '& .SCComposer-block': {
            marginBottom: theme.spacing(4)
          }
        },
        '& .SCComposer-block': {
          padding: theme.spacing(1)
        },
        '& .SCComposer-editor': {
          minHeight: 200,
          '& .SCEditor-placeholder': {
            top: theme.spacing(1),
            left: theme.spacing(1)
          }
        },
        '& .SCComposer-divider': {
          borderTop: '1px solid #D1D1D1'
        },
        '& .SCComposer-medias': {
          margin: '0 23px'
        },
        '& .SCComposer-location, & .SCComposer-audience': {
          padding: theme.spacing(2),
          paddingBottom: 0
        },
        '& .SCComposer-mediasActions': {
          position: 'absolute',
          left: 0,
          right: 0,
          background: mediaActionBackground,
          padding: theme.spacing(),
          zIndex: 1,
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          '& .SCComposer-mediasActionsActions': {
            textAlign: 'right'
          }
        },
        '& .SCComposer-sortableMedia': {
          position: 'relative'
        },
        '& .SCComposer-sortableMediaCover': {
          backgroundSize: 'cover !important',
          backgroundPosition: 'center !important',
          backgroundRepeat: 'no-repeat !important',
          border: '2px solid white',
          borderRadius: 6,
          height: 300
        },
        '& .SCComposer-links': {
          padding: theme.spacing(2)
        },
        '& .SCComposer-actions': {
          margin: 0,
          borderTop: '1px solid #D1D1D1',
          padding: theme.spacing(1),
          '& .SCComposer-media-actions': {},
          '& .SCComposer-filter-actions': {
            flexGrow: 1,
            textAlign: 'right'
          },
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        '& .SCComposer-actionInput': {
          display: 'none !important'
        },
        '& .SCComposer-badgeError .MuiBadge-badge': {
          padding: 0
        },
        '& .MuiDialog-paper': {
          padding: theme.spacing(2, 3, 3)
        },
        '& .SCComposer-mediaContent': {
          '& .SCMediaActionImage-root': {
            padding: 0,
            '& .SCMediaActionImage-upload': {
              padding: theme.spacing(2),
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.primary.main,
              '&.SCMediaActionImage-dragOver': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
              },
              '& .SCMediaActionImage-uploadBtn': {
                border: '0 none'
              }
            }
          },
          '& .SCMediaActionDocument-root': {
            padding: 0,
            '& .SCMediaActionDocument-upload': {
              padding: theme.spacing(2),
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.primary.main,
              '&.SCMediaActionDocument-dragOver': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
              },
              '& .SCMediaActionDocument-uploadBtn': {
                border: '0 none'
              }
            }
          }
        },
        '& .SCComposer-locationContent': {
          padding: theme.spacing(3, 0),
          minHeight: 300
        },
        '& .MuiDialog-container': {
          '& .MuiDialog-paper': {
            boxShadow: theme.shadows[12],
            [theme.breakpoints.up('md')]: {
              borderRadius: theme.shape.borderRadius
            },
            '&.MuiDialog-paperFullScreen': {
              height: 'auto',
              minHeight: '100%'
            }
          }
        },
        '& .SCCategoryAutocomplete-root': {
          minWidth: 120,
          '& .MuiFormControl-root': {
            margin: 0
          }
        },
        '& .MuiDialog-paperFullScreen': {
          // Mobile view
          position: 'relative',
          '& .SCComposer-title': {
            transition: 'opacity 200ms cubic-bezier(0.250, 0.250, 0.750, 0.750)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: theme.spacing(2, 3),
            backgroundColor: theme.palette.background.paper,
            zIndex: 1000
          },
          '& .SCComposer-content': {
            transition: 'padding 100ms cubic-bezier(0.250, 0.250, 0.750, 0.750)',
            padding: theme.spacing(9, 0)
          },
          '& .SCComposer-actions': {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: theme.spacing(2, 2),
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            '& .SCComposer-media-actions': {
              borderRight: `1px solid ${theme.palette.grey[400]}`,
              paddingRight: theme.spacing(1)
            },
            '& .SCComposer-filter-actions': {
              textAlign: 'right'
            }
          }
        },
        '&.SCComposer-writing': {
          '& .MuiDialog-paperFullScreen': {
            // Expanded view for editor
            '& .SCComposer-title': {
              opacity: 0
            },
            '& .SCComposer-title-dense': {
              position: 'fixed',
              top: theme.spacing(2),
              right: theme.spacing(2),
              zIndex: 1002,
              borderRadius: theme.shape.borderRadius * 0.2,
              borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              borderWidth: 1,
              borderStyle: 'solid',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'left',
              '& .MuiButtonBase-root': {
                margin: theme.spacing(0.5),
                padding: theme.spacing(1),
                fontSize: '1rem',
                border: 0,
                borderRadius: theme.shape.borderRadius * 0.2
              }
            },
            '& .SCComposer-content': {
              paddingTop: 0,
              '& .SCComposer-block': {
                height: 0,
                overflow: 'hidden',
                margin: 0
              },
              '& .SCEditor-root': {
                marginTop: theme.spacing(6),
                '& .SCEditorToolbarPlugin-root': {
                  position: 'fixed',
                  top: theme.spacing(2),
                  left: theme.spacing(3),
                  right: theme.spacing(12),
                  zIndex: 1001
                },
                '& .SCEditor-placeholder': {
                  top: 0
                }
              }
            },
            '& .SCComposer-actions': {}
          }
        },
        '&.SCComposer-ios .SCComposer-actions': {
          marginBottom: '10px'
        }
      };
    }
  }
};

export default Component;
