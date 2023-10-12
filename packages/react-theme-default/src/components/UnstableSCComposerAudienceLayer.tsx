const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiTabs-root': {
        minHeight: 'auto',
        marginBottom: theme.spacing(4),
        '& .MuiTabs-flexContainer': {
          justifyContent: 'center',
          '& .MuiTab-labelIcon': {
            minHeight: 'auto',
            flexDirection: 'row',
            '& .MuiIcon-root': {
              marginRight: theme.spacing(1)
            }
          }
        }
      },
      '& .UnstableSCComposerAudienceLayer-message': {
        textAlign: 'center',
        marginBottom: theme.spacing(4)
      }
    })
  }
};

export default Component;
