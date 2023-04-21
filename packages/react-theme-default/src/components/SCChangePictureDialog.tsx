const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      // padding: theme.spacing(1),
      // minWidth: 'auto'
      '& .SCChangePictureDialog-image-item': {
        '& .MuiImageListItemBar-actionIcon, .MuiIconButton-root': {
          color: theme.palette.common.white
        },
        '& .SCChangePictureDialog-primary': {
          border: 'solid'
        }
      }
    })
  }
};

export default Component;
