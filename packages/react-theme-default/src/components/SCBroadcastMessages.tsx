import {red} from '@mui/material/colors';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCBroadcastMessages-box-load-more': {
        textAlign: 'center',
        '& > div': {
          paddingBottom: theme.spacing(2)
        },
        marginBottom: theme.spacing(2)
      },
      '& .SCBroadcastMessages-avatar-load-more': {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginRight: theme.spacing()
      },
      '& .SCBroadcastMessages-button-load-more': {
        textTransform: 'initial'
        // textTransform: 'capitalize',
        // marginLeft: -10
      }
    }),
    messageRoot: ({theme}: any) => ({
      width: '100%',
      marginBottom: theme.spacing(2),
      '& .SCBroadcastMessages-header .MuiAvatar-img': {
        objectFit: 'fill'
      },
      '& .SCBroadcastMessages-title': {
        padding: `${theme.spacing(2)}`,
        paddingBottom: `${theme.spacing()}`,
        paddingTop: 0
      },
      '& .SCBroadcastMessages-media': {
        paddingBottom: `${theme.spacing(2)}`
      },
      '& .SCBroadcastMessages-content': {
        padding: theme.spacing(2),
        paddingTop: 0
      },
      '& .SCBroadcastMessages-list-item-snippet': {
        padding: '0px 5px',
        alignItems: 'center'
      },
      '& .SCBroadcastMessages-list-item-snippet-new': {
        borderLeft: '2px solid red'
      },
      '& .SCBroadcastMessages-flag-icon-wrap': {
        minWidth: 'auto',
        paddingRight: 10
      },
      '& .SCBroadcastMessages-flag-icon-snippet': {
        backgroundColor: red[500],
        color: '#FFF',
        width: 30,
        height: 30
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    messageSkeletonRoot: ({theme}: any) => ({
      marginBottom: theme.spacing(2)
    })
  }
};

export default Component;
