import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCFeedRelevantActivities-activity': {
        '& > .SCBaseItem-root': {
          borderRadius: 0,
          marginBottom: theme.spacing(2),
          '& .SCBaseItem-text': {
            margin: 0,
            '& .SCBaseItem-primary': {
              display: 'inline-block',
              marginBottom: theme.spacing(0.5),
              '& > a': {
                fontWeight: theme.typography.fontWeightBold,
                textDecoration: 'none'
              }
            },
            '& .SCBaseItem-secondary': {
              fontSize: '0.857rem'
            }
          }
        }
      }
    })
  }
};

export default Component;
