const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      margin: 0,
      padding: 0,
      '& .SCSnippetNotificationsSkeleton-item': {
        padding: 0,
        marginBottom: theme.spacing(),
        '& .SCNotificationItem-root': {
          backgroundColor: 'transparent',
          borderRadius: 0,
          '&.SCNotificationItem-snippet': {
            '&:before': {
              borderRadius: theme.shape.borderRadius,
              width: theme.spacing(0.6),
              left: 1,
              height: '100%',
              display: 'block',
              zIndex: '20',
              position: 'absolute',
              content: '" "',
              backgroundColor: 'rgba(84, 110, 122, 0.3)'
            },
            '&.SCNotificationItem-new': {
              '&:before': {
                backgroundColor: theme.palette.primary.main
              }
            },
            '& .SCNotificationItem-header': {
              padding: theme.spacing(1, 2)
            }
          }
        }
      }
    })
  }
};

export default Component;
