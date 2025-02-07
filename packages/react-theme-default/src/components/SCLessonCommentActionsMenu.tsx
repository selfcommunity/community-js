import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLessonCommentActionsMenu-button': {
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        }
      }
    }),
    popperRoot: ({theme}: any) => ({
      zIndex: 1200,
      '& .SCLessonCommentActionsMenu-popper-root': {
        overflow: 'visible',
        filter: 'drop-shadow(0px -1px 5px rgba(0,0,0,0.10))',
        mt: 1.5
      },
      '& .SCLessonCommentActionsMenu-paper': {
        width: 280,
        '& .SCLessonCommentActionsMenu-sub-item': {
          '& .MuiListItemIcon-root': {
            color: theme.palette.text.secondary
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity)
          }
        }
      }
    })
  }
};

export default Component;
