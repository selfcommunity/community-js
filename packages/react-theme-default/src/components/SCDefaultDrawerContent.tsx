const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCDefaultDrawerContent-no-results': {
        paddingLeft: theme.spacing(2)
      },
      '& .SCDefaultDrawerContent-title': {
        paddingTop: theme.spacing(1)
      },
      '& .SCDefaultDrawerContent-navigation': {
        paddingTop: theme.spacing(0.5),
        paddingBottom: 0,
        '& .MuiListItemButton-root': {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          '& .MuiListItemText-root .MuiTypography-root': {
            fontWeight: 700
          }
        },
        '& .MuiListItemIcon-root': {
          minWidth: 0,
          marginRight: theme.spacing(2)
        },
        '& .MuiIcon-root': {
          fontSize: 18
        }
      },
      '& .MuiAccordion-root': {
        '& .MuiAccordionSummary-content': {
          marginBottom: theme.spacing(1.5)
        },
        '& .MuiAccordionDetails-root, .MuiList-root': {
          paddingTop: 0
        }
      }
    })
  }
};

export default Component;
