import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      backgroundColor:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? theme.palette.background.paper
          : theme.palette.common.white,
      border:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? `1px solid ${theme.palette.grey[800]}`
          : `1px solid ${theme.palette.grey[300]}`,
      borderRadius: '5px',

      '& .SCAccordionLessons-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },

      '& .SCAccordionLessons-empty': {
        padding: theme.spacing('19px', 3)
      },

      '& .SCAccordionLessons-accordion': {
        '& .SCAccordionLessons-summary': {
          flexDirection: 'row-reverse',
          gap: theme.spacing(1),
          borderBottom:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? `1px solid ${theme.palette.grey[800]}`
              : `1px solid ${theme.palette.grey[300]}`,
          padding: theme.spacing('22px', 3),
          backgroundColor:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.grey[700] : theme.palette.grey[200],

          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            margin: 0,

            '& .SCAccordionLessons-name-wrapper': {
              flexDirection: 'row',
              alignItems: 'center',
              gap: '5px'
            }
          }
        },

        '& .SCAccordionLessons-details': {
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(1),
          padding: theme.spacing('22px', 6),

          '&:not(:last-child)': {
            borderBottom:
              getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
                ? `1px solid ${theme.palette.grey[800]}`
                : `1px solid ${theme.palette.grey[300]}`
          },

          '& .SCAccordionLessons-circle': {
            flexShrink: 0,
            width: theme.spacing(2),
            height: theme.spacing(2),
            borderRadius: '9999px',
            backgroundColor: theme.palette.common.white
          },

          '& .SCAccordionLessons-link': {
            textDecoration: 'underline',
            padding: 0,
            justifyContent: 'space-between',

            '&:hover': {
              backgroundColor: 'unset',
              textDecoration: 'underline'
            }
          }
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      border:
        getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
          ? `1px solid ${theme.palette.grey[800]}`
          : `1px solid ${theme.palette.grey[300]}`,
      borderRadius: '5px',

      '& .SCAccordionLessons-accordion': {
        '& .SCAccordionLessons-summary': {
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? `1px solid ${theme.palette.grey[800]}`
              : `1px solid ${theme.palette.grey[300]}`,
          padding: theme.spacing('22px', 3),
          backgroundColor:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5 ? theme.palette.grey[700] : theme.palette.grey[200]
        }
      }
    })
  }
};

export default Component;
