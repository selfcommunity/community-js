const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      padding: theme.spacing(1),
      minWidth: 'auto'
    }),
    dialogRoot: ({theme}: any) => ({
      '& .MuiDialogContent-root': {
        paddingLeft: theme.spacing(2)
      },
      '& .SCChangePictureButton-images-list': {
        maxHeight: 500
      },
      '& .SCChangePictureButton-image-item': {
        '& .MuiImageListItemBar-actionIcon, .MuiIconButton-root': {
          color: theme.palette.common.white
        },
        '& .SCChangePictureButton-primary': {
          border: 'solid'
        }
      }
    })
  }
};

export default Component;
