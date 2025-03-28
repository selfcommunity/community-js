import {getContrastRatio} from '@mui/material';

const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '&.SCAddUsersButton-contrast-color': {
        color: getContrastRatio(theme.palette.background.default, theme.palette.common.white) > 4.5 ? theme.palette.common.white : undefined
      }
    }),
    dialogRoot: () => ({
      '& .MuiDialogActions-root': {
        marginTop: '36px'
      },

      '& .SCAddUsersButton-dialog-autocomplete-wrapper': {
        gap: '10px',

        '& .SCAddUsersButton-dialog-chip-wrapper': {
          flexDirection: 'row',
          gap: '5px',
          flexWrap: 'wrap'
        }
      }
    })
  }
};

export default Component;
