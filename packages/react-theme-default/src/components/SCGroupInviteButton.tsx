import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiIcon-root': {
        fontSize: '1rem !important'
      }
    }),
    dialogRoot: ({theme}: any) => ({
      '& .SCBaseDialog-title-root span ': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .SCGroupInviteButton-dialog-title': {
          fontWeight: theme.typography.fontWeightBold,
          fontSize: theme.typography.h4.fontSize
        }
      },
      '& .SCGroupInviteButton-input': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(3.75),
        padding: theme.spacing(0.5, 1),
        '& .SCGroupInviteButton-icon ': {
          marginLeft: theme.spacing(1)
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: '1px solid'
        }
      },
      '& .SCGroupInviteButton-invited-box': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
      },
      '& .SCGroupInviteButton-suggested': {
        '& h4': {
          marginBottom: theme.spacing(1)
        },
        '& .SCUser-root': {
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
          }
        }
      }
    })
  }
};

export default Component;
