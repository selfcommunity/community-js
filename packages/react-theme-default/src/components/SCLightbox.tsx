import {keyframes} from '@emotion/react';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => {
      const closeWindow = keyframes`
        0% {
          opacity: 1
        }
        100% {
          opacity: 0;
        }`;

      const pointFade = keyframes`
        0%, 19.999%,
        100% { {
          opacity: 1
        }
        20% {
          opacity: 0;
        }`;
      return {
        zIndex: 2000,
        backgroundColor: 'transparent',
        '& .SCLightbox-ril-outer': {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          outline: 'none',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          width: '100%',
          height: '100vh',
          msContentZooming: 'none',
          msUserSelect: 'none',
          msTouchSelect: 'none',
          touchAction: 'none'
        },
        '& .SCLightbox-ril-outer-closing': {
          opacity: 0
        },
        '& .SCLightbox-ril-inner': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        '& .SCLightbox-ril-image': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 'auto',
          maxWidth: 'none',
          msContentZooming: 'none',
          msUserSelect: 'none',
          msTouchSelect: 'none',
          touchAction: 'none'
        },
        '& .SCLightbox-ril-image-discourager': {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        },
        '& .SCLightbox-ril-nav-buttons': {
          border: 'none',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 20,
          height: 34,
          padding: '40px 30px',
          margin: 'auto',
          cursor: 'pointer',
          opacity: 0.7,
          '&:hover': {
            opacity: 1
          },
          '&:active': {
            opacity: 1
          }
        },

        '& .SCLightbox-ril-nav-button-prev': {
          left: 0,
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 0,
          color: '#FFF',
          '& span': {
            fontSize: 39
          }
        },

        '& .SCLightbox-ril-nav-button-next': {
          right: 0,
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 0,
          color: '#FFF',
          '& span': {
            fontSize: 39
          }
        },

        '& .SCLightbox-ril-download-blocker': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');",
          backgroundSize: 'cover'
        },
        '& .SCLightbox-ril-caption': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          bottom: 0,
          maxHeight: 150,
          overflow: 'auto'
        },
        '& .SCLightbox-ril-toolbar': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          height: 50
        },
        '& .SCLightbox-ril-caption-content': {
          padding: '10px 20px',
          color: '#fff'
        },
        '& .SCLightbox-ril-toolbar-side': {
          height: 50,
          margin: 0
        },
        '& .SCLightbox-ril-toolbar-left-side': {
          paddingLeft: 20,
          paddingRight: 0,
          flex: '0 1 auto',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        '& .SCLightbox-ril-toolbar-right-side': {
          paddingLeft: 0,
          paddingRight: 20,
          flex: '0 0 auto'
        },
        '& .SCLightbox-ril-toolbar-item': {
          display: 'inline-block',
          lineHeight: '50px',
          padding: 0,
          color: '#fff',
          fontSize: '120%',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        '& .SCLightbox-ril-toolbar-item-child': {
          verticalAlign: 'middle'
        },
        '& .SCLightbox-ril-builtin-button': {
          width: 40,
          height: 35,
          cursor: 'pointer',
          border: 'none',
          opacity: 0.7,
          '&:hover': {
            opacity: 1
          },
          '&:active': {
            outline: 'none'
          }
        },
        '& .SCLightbox-ril-builtin-button-disabled': {
          cursor: 'default',
          opacity: 0.5,
          '&:hover': {
            opacity: 0.5
          }
        },
        '& .SCLightbox-ril-close-button': {
          background: 'rgba(0, 0, 0, 0.2)',
          '& span': {
            color: '#FFF',
            fontSize: 32
          }
        },
        '& .SCLightbox-ril-zoom-in-button': {
          background: 'rgba(0, 0, 0, 0.2)',
          marginRight: theme.spacing(3),
          '& span': {
            color: '#FFF',
            fontSize: 32
          }
        },
        '& .SCLightbox-ril-zoom-out-button': {
          background: 'rgba(0, 0, 0, 0.2)',
          marginRight: theme.spacing(5),
          '& span': {
            color: '#FFF',
            fontSize: 32
          }
        },
        '& .SCPrivateMessageThreadItem-download-button': {
          background: 'rgba(0, 0, 0, 0.2)',
          marginRight: theme.spacing(3),
          '& span': {
            color: '#FFF',
            fontSize: 32
          }
        },
        '& .SCLightbox-ril-outer-animating': {
          animationName: `${closeWindow}`
        },
        '& .SCLightbox-ril-loading-circle': {
          width: 60,
          height: 60,
          position: 'relative'
        },

        '& .SCLightbox-ril-loading-circle-point': {
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          '&:before': {
            content: '""',
            display: 'block',
            margin: '0 auto',
            width: '11%',
            height: '30%',
            backgroundColor: '#fff',
            borderRadius: '30%',
            animation: `${pointFade} 800ms infinite ease-in-out both`
          },
          '&:nth-of-type(1)': {
            transform: 'rotate(0deg)',
            '&:before': {
              animationDelay: '-800ms'
            }
          },
          '&:nth-of-type(7)': {
            transform: 'rotate(180deg)',
            '&:before': {
              animationDelay: '-800ms'
            }
          },
          '&:nth-of-type(2)': {
            transform: 'rotate(30deg)',
            '&:before': {
              animationDelay: '-666ms'
            }
          },
          '&:nth-of-type(8)': {
            transform: 'rotate(210deg)',
            '&:before': {
              animationDelay: '-666ms'
            }
          },
          '&:nth-of-type(3)': {
            transform: 'rotate(60deg)',
            '&:before': {
              animationDelay: '-533ms'
            }
          },
          '&:nth-of-type(9)': {
            transform: 'rotate(240deg)',
            '&:before': {
              animationDelay: '-533ms'
            }
          },
          '&:nth-of-type(4)': {
            transform: 'rotate(90deg)',
            '&:before': {
              animationDelay: '-400ms'
            }
          },
          '&:nth-of-type(10)': {
            transform: 'rotate(270deg)',
            '&:before': {
              animationDelay: '-400ms'
            }
          },
          '&:nth-of-type(5)': {
            transform: 'rotate(120deg)',
            '&:before': {
              animationDelay: '-266ms'
            }
          },
          '&:nth-of-type(11)': {
            transform: 'rotate(300deg)',
            '&:before': {
              animationDelay: '-266ms'
            }
          },
          '&:nth-of-type(6)': {
            transform: 'rotate(150deg)',
            '&:before': {
              animationDelay: '-133ms'
            }
          },
          '&:nth-of-type(12)': {
            transform: 'rotate(330deg)',
            '&:before': {
              animationDelay: '-133ms'
            }
          },
          '&:nth-of-type(13)': {
            transform: 'rotate(360deg)',
            '&:before': {
              animationDelay: '0ms'
            }
          }
        },
        '& .SCLightbox-ril-loading-container': {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        '& .SCLightbox-ril-error-container': {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        },
        '& .SCLightbox-ril-loading-container-icon': {
          color: '#fff',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)'
        },
        '& .SCLightbox-ril-image-prev': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 'auto',
          maxWidth: 'none',
          msContentZooming: 'none',
          msUserSelect: 'none',
          msTouchSelect: 'none',
          touchAction: 'none',
          '& .SCLightbox-ril-loading-container': {
            display: 'none'
          }
        },
        '& .SCLightbox-ril-image-next': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 'auto',
          maxWidth: 'none',
          msContentZooming: 'none',
          msUserSelect: 'none',
          msTouchSelect: 'none',
          touchAction: 'none',
          '& .SCLightbox-ril-loading-container': {
            display: 'none'
          },
          '& .SCLightbox-ril-error-container': {
            display: 'none'
          }
        }
      };
    }
  }
};

export default Component;
