import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '&.SCFeedObject-preview, &.SCFeedObject-detail': {
        border: `0 none`,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        [theme.breakpoints.up('sm')]: {
          borderRadius: theme.shape.borderRadius
        },
        '& .SCFeedObject-category': {
          borderBottom: '1px solid rgba(221, 221, 221, 1)',
          margin: theme.spacing(0, 2)
        },
        '& .SCFeedObject-header': {
          '& .SCFeedObject-username': {
            fontWeight: theme.typography.fontWeightMedium
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.857rem',
            marginTop: theme.spacing(0.5),
            '& .SCFeedObject-activity-at': {
              marginTop: 0,
              '&:hover': {
                color: 'inherit',
                textDecoration: 'underline'
              }
            },
            '& .SCFeedObject-tag': {
              '& .MuiIcon-root': {
                fontSize: '1rem',
                lineHeight: '1.143rem'
              }
            }
          }
        },
        '& .SCFeedObject-content': {
          '& .SCFeedObject-title-section': {
            '& .SCFeedObject-title': {
              fontWeight: theme.typography.fontWeightBold,
              marginBottom: theme.spacing(1)
            },
            '& a': {
              color: 'inherit'
            }
          },
          '& .SCFeedObject-text-section': {
            '& > :first-child': {
              padding: theme.spacing(0, 2, 2)
            },
            '& a': {
              '&:hover': {
                textDecoration: 'underline',
                color: 'inherit'
              }
            }
          }
        },
        '& .SCFeedObject-actions-section': {
          marginBottom: theme.spacing(1),
          '& .SCFeedObjectActions-root': {
            margin: 0,
            padding: theme.spacing(2, 2, 0, 2),
            '& .SCFeedObjectActions-action': {
              '& .SCVoteAction-view-audience-button, & .SCCommentAction-view-audience-button, & .SCShareAction-view-audience-button, & .SCReactionAction-view-audience-button':
                {
                  fontSize: '0.857rem',
                  fontWeight: theme.typography.fontWeightRegular,
                  marginTop: theme.spacing(1),
                  marginBottom: 0,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: 'inherit'
                  },
                  '& .SCReactionAction-grouped-icons': {
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                },
              '& .MuiDivider-root': {
                borderColor: theme.palette.grey[300]
              },
              '& .SCVoteAction-action-button, & .SCCommentAction-action-button, & .SCShareAction-action-button, & .SCReactionAction-action-button': {
                marginTop: theme.spacing(0.5),
                marginBottom: theme.spacing(0.5),
                borderRadius: '50%',
                padding: theme.spacing(1.5),
                minWidth: 0,
                '& .MuiIcon-root': {
                  fontSize: '1.571rem'
                },
                '& .SCReactionAction-reaction-icon': {
                  '>img': {
                    height: '18px',
                    width: '18px'
                  }
                }
              }
            }
          },
          '& .SCFeedObject-reply-content': {
            marginLeft: 0,
            background: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
            '& .SCReplyCommentObject-root': {
              background: 'transparent',
              '& .SCReplyCommentObject-comment': {
                background: 'transparent',
                border: '0 none',
                '& .SCEditor-root': {
                  '& .SCEditor-placeholder': {
                    fontWeight: theme.typography.fontWeightMedium
                  },
                  '& .SCEditor-content': {
                    paddingBottom: 0,
                    minHeight: 0
                  },
                  '& .SCEditor-actions': {
                    bottom: 0
                  }
                }
              }
            }
          }
        },
        '& .SCFeedObject-activities-section': {
          '& .SCFeedObject-activities-content': {
            paddingTop: 0,
            '& .SCActivitiesMenu-selector': {
              '& .MuiButton-root': {
                fontSize: '0.857rem',
                fontWeight: theme.typography.fontWeightRegular,
                padding: theme.spacing(1)
              }
            },
            '& .SCCommentObject-root': {
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0
            }
          },
          '& .SCCommentObjectSkeleton-root': {
            background: 'transparent',
            marginTop: 5,
            marginBottom: '7px !important',
            '& .SCBaseItem-text': {
              '& .SCWidget-root': {
                '& .MuiCardContent-root': {
                  padding: theme.spacing()
                }
              }
            }
          },
          '& .SCReplyCommentObject-root': {
            '& .SCReplyCommentObject-comment': {
              marginBottom: '0 !important',
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: theme.shape.borderRadius,
              '& .SCEditor-root': {
                minHeight: theme.spacing(4),
                marginTop: 0,
                '& .SCEditor-content': {
                  minHeight: 0
                },
                '& .SCEditor-actions': {
                  bottom: theme.spacing(-4)
                }
              }
            }
          }
        }
      },
      '&.SCFeedObject-snippet': {
        '& .SCFeedObject-username': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          display: 'block',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-snippet-content': {
          fontSize: '1rem',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-activity-at': {
          marginTop: 0,
          '&:hover': {
            color: 'inherit',
            textDecoration: 'underline'
          }
        }
      },
      '&.SCFeedObject-detail .SCFeedObject-reply-content': {
        borderBottom: '0 none'
      }
    })
  }
};

export default Component;
