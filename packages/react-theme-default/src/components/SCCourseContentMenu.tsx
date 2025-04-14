const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiList-root': {
        '& .Mui-selected': {
          backgroundColor: theme.palette.grey[300],
          '&:hover, &:focus, &:active': {
            backgroundColor: theme.palette.grey[300]
          }
        },
        '& .MuiButtonBase-root': {
          paddingLeft: theme.spacing(5)
        }
      },
      '& .SCCourseContentMenu-list-item': {
        '&:hover, &:focus, &:active': {
          backgroundColor: 'transparent'
        }
      },
      '& .SCCourseContentMenu-list-item-icon': {
        minWidth: theme.spacing(3),
        color: theme.palette.text.secondary
      },
      '& .SCCourseContentMenu-item': {
        '& .MuiListItemText-primary': {
          fontWeight: theme.typography.fontWeightMedium
        },
        '&:hover': {backgroundColor: 'transparent'}
      },
      '& .SCCourseContentMenu-item-icon': {
        minWidth: theme.spacing(4)
      },
      '& .SCCourseContentMenu-icon-complete': {
        color: theme.palette.success.main
      },
      '& .SCCourseContentMenu-icon-incomplete': {
        color: theme.palette.grey[300]
      }
    })
  }
};

export default Component;
