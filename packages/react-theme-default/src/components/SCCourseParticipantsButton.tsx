import {darken, getContrastRatio, lighten} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme, enrolled}) => ({
      padding: 0,
      gap: theme.spacing(1),
      marginTop: '0 !important',
      minWidth: 'auto',

      '&:hover': {
        backgroundColor: 'unset'
      },

      '& .SCCourseParticipantsButton-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },

      '& .MuiAvatarGroup-root': {
        '&:not(.SCAvatarCourseSkeleton-root) .MuiAvatar-root': {
          '&.MuiAvatar-colorDefault': {
            marginLeft: 0,
            backgroundColor: 'transparent',
            color:
              getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
                ? lighten(theme.palette.common.white, 0.5)
                : darken(theme.palette.common.white, 0.5),
            border: '0 none',
            borderRadius: 0,
            padding: 1
          }
        },

        '& .MuiAvatar-root': {
          height: theme.selfcommunity.user.avatar.sizeSmall,
          border:
            getContrastRatio(theme.palette.background.paper, theme.palette.common.white) > 4.5
              ? 'rgba(255, 255, 255, 0.12)'
              : `1px solid ${theme.palette.common.white}`,
          fontSize: '0.7rem',

          '&:first-of-type': {
            width: enrolled > 3 ? 'auto' : theme.selfcommunity.user.avatar.sizeSmall
          },

          '&:not(:first-of-type)': {
            width: theme.selfcommunity.user.avatar.sizeSmall
          }
        }
      },

      '& .SCCourseParticipantsButton-participants': {
        '& .MuiIcon-root': {
          marginRight: theme.spacing(1)
        }
      }
    }),
    dialogRoot: ({theme}) => ({
      '& .SCCourseParticipantsButton-dialog-paper-contrast-color': {
        color: theme.palette.getContrastText(theme.palette.background.paper)
      },

      '& .SCCourseParticipantsButton-infinite-scroll': {
        height: '400px !important',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        }
      }
    })
  }
};

export default Component;
