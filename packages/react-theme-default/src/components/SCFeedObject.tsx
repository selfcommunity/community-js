import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '&.SCFeedObject-preview, &.SCFeedObject-detail, &.SCFeedObject-search': {
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
          '& .MuiCardHeader-avatar': {
            marginRight: theme.spacing(1)
          },
          '& .SCFeedObject-username': {
            fontWeight: theme.typography.fontWeightMedium
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.857rem',
            color: theme.palette.primary.main,
            '& .SCFeedObject-activity-at': {
              marginTop: 0,
              display: 'inline-flex',
              '&:hover': {
                color: 'inherit',
                textDecoration: 'underline'
              }
            },
            '& .SCFeedObject-tag': {
              '& .MuiIcon-root': {
                fontSize: '1rem',
                lineHeight: '1.143rem',
                color: 'inherit'
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
            '& > :first-of-type': {
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
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: 'inherit'
                  }
                },
              '& .MuiDivider-root': {
                borderColor: theme.palette.grey[300]
              },
              '& .SCVoteAction-button, & .SCCommentAction-button, & .SCShareAction-button, & .SCReactionAction-button': {
                color: theme.palette.primary.main,
                marginTop: theme.spacing(0.5),
                marginBottom: theme.spacing(0.5),
                borderRadius: '50%',
                padding: theme.spacing(1.5),
                minWidth: 0,
                '& .MuiIcon-root': {
                  fontSize: '1.571rem'
                },
                '& > img': {
                  width: '1.571rem',
                  height: '1.571rem'
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
          display: 'inline-flex',
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
