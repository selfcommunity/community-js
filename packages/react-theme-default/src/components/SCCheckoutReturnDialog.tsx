const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .MuiDialogTitle-root': {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 600
      },
      '& .MuiDialogContent-root': {
        display: 'flex',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        '& .SCWidget-root': {
          minWidth: 310,
          paddingLeft: theme.spacing()
        }
      },
      '& .SCCheckoutSuccessDialog-content-object': {
        width: '100%'
      },
			'& .SCCourse-preview-root': {
				minHeight: 'auto'
			},
    })
  }
};

export default Component;
