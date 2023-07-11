import {keyframes} from '@emotion/react';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => {
      const PhotoViewRotate = keyframes`
        0% {
          transform: rotate(0deg)
        }
        to {
          transform: rotate(1turn)
        }`;
      const PhotoViewDelayIn = keyframes`
        0%, 50% {
          opacity: 0
        }
        to {
          opacity: 1
        }`;

      const PhotoViewFade = keyframes`
        0% {
          opacity: 0
        }
        to {
          opacity: 1
        }`;

      return {
        height: '100%',
        left: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        touchAction: 'none',
        width: '100%',
        zIndex: 2000,
        ['& .PhotoView__Spinner']: {
          '-webkit-animation': `${PhotoViewDelayIn} .4s linear both`,
          animation: `${PhotoViewDelayIn} .4s linear both`
        },
        ['& .PhotoView__Spinner svg']: {
          '-webkit-animation': `${PhotoViewRotate} .6s linear infinite`,
          animation: `${PhotoViewRotate} .6s linear infinite`
        },
        ['& .PhotoView__Photo']: {
          cursor: 'grab',
          maxWidth: 'none'
        },
        ['& .PhotoView__Photo:active']: {
          cursor: 'grabbing',
          ['&:active']: {
            opacity: 1
          }
        },
        ['& .PhotoView__icon']: {
          display: 'inline-block',
          left: 0,
          position: 'absolute',
          top: 0,
          transform: 'translate(-50%, -50%)'
        },
        ['& .PhotoView__PhotoBox']: {
          bottom: 0,
          direction: 'ltr',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          touchAction: 'none',
          width: '100%',
          transformOrigin: 'left top'
        },
        ['& .PhotoView__PhotoWrap']: {
          bottom: 0,
          direction: 'ltr',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          touchAction: 'none',
          width: '100%',
          overflow: 'hidden',
          zIndex: 10
        },
        ['& .PhotoView-Slider__clean .PhotoView-Slider__ArrowLeft, .PhotoView-Slider__clean .PhotoView-Slider__ArrowRight, .PhotoView-Slider__clean .PhotoView-Slider__BannerWrap, .PhotoView-Slider__clean .PhotoView-Slider__Overlay, .PhotoView-Slider__willClose .PhotoView-Slider__BannerWrap:hover']:
          {
            opacity: 0
          },
        ['& .PhotoView-Slider__Backdrop']: {
          background: '#000',
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          transitionProperty: 'background-color',
          width: '100%',
          zIndex: -1
        },
        ['& .PhotoView-Slider__fadeIn']: {
          '-webkit-animation': `${PhotoViewFade} linear both`,
          animation: `${PhotoViewFade} linear both`,
          opacity: 0
        },
        ['& .PhotoView-Slider__fadeOut']: {
          animation: `${PhotoViewFade} linear reverse both`,
          opacity: 0
        },
        ['& .PhotoView-Slider__BannerWrap']: {
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, .5)',
          color: '#fff',
          display: 'flex',
          height: 44,
          justifyContent: 'space-between',
          left: 0,
          position: 'absolute',
          top: 0,
          transition: 'opacity .2s ease-out',
          width: '100%',
          zIndex: 20,
          ['&:hover']: {
            opacity: 1
          }
        },
        ['& .PhotoView-Slider__Counter']: {
          fontSize: '14px',
          opacity: 0,
          padding: '0 10px'
        },
        ['& .PhotoView-Slider__BannerRight']: {
          alignItems: 'center',
          display: 'flex',
          height: '100%'
        },
        ['& .PhotoView-Slider__toolbarIcon']: {
          fill: '#fff',
          boxSizing: 'border-box',
          cursor: 'pointer',
          opacity: 0.75,
          padding: '10px',
          transition: 'opacity .2s linear'
        },
        ['& .PhotoView-Slider__toolbarIcon:hover']: {
          opacity: 1
        },
        ['& .PhotoView-Slider__ArrowLeft']: {
          alignItems: 'center',
          bottom: 0,
          cursor: 'pointer',
          display: 'flex',
          height: 100,
          justifyContent: 'center',
          margin: 'auto',
          opacity: 0.75,
          position: 'absolute',
          top: 0,
          transition: 'opacity .2s linear',
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          userSelect: 'none',
          width: 70,
          zIndex: 20,
          left: 0,
          ['& svg']: {
            fill: '#fff',
            background: 'rgba(0, 0, 0, .3)',
            boxSizing: 'content-box',
            height: 24,
            padding: 10,
            width: 24
          },
          ['&:hover']: {
            opacity: 1
          }
        },
        ['& .PhotoView-Slider__ArrowRight']: {
          alignItems: 'center',
          bottom: 0,
          cursor: 'pointer',
          display: 'flex',
          height: 100,
          justifyContent: 'center',
          margin: 'auto',
          opacity: 0.75,
          position: 'absolute',
          top: 0,
          transition: 'opacity .2s linear',
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          userSelect: 'none',
          width: 70,
          zIndex: 20,
          right: 0,
          ['& svg']: {
            fill: '#fff',
            background: 'rgba(0, 0, 0, .3)',
            boxSizing: 'content-box',
            height: 24,
            padding: 10,
            width: 24
          },
          ['&:hover']: {
            opacity: 1
          }
        }
      };
    }
  }
};

export default Component;
