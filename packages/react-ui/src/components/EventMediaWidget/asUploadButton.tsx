import {markAsUploadOptionsComponent, useUploadyContext} from '@rpldy/shared-ui';
import {forwardRef, useCallback, useRef} from 'react';

import type {UploadOptions} from '@rpldy/shared';
import {UploadButtonProps} from '@rpldy/upload-button';
import type {ComponentType, MouseEvent, Ref} from 'react';

type FileInputProps = {
  accept: string;
};

const asUploadButton = (Component: ComponentType<any>, inputProps: FileInputProps) => {
  const AsUploadButton = (props: UploadButtonProps, ref: Ref<any>) => {
    const {showFileUpload, getInternalFileInput} = useUploadyContext();
    const {id, className, text, children, extraProps, onClick, ...uploadOptions} = props;

    //using ref so onButtonClick can stay memoized
    const uploadOptionsRef = useRef<UploadOptions>();
    uploadOptionsRef.current = uploadOptions;

    const onButtonClick = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const input = getInternalFileInput();
        input.current.accept = inputProps.accept;

        showFileUpload(uploadOptionsRef.current);
        onClick?.(e);
      },
      [getInternalFileInput, showFileUpload, uploadOptionsRef, onClick]
    );

    return <Component ref={ref} onClick={onButtonClick} id={id} className={className} children={children || text || 'Upload'} {...extraProps} />;
  };

  markAsUploadOptionsComponent(AsUploadButton);

  return forwardRef(AsUploadButton);
};

export default asUploadButton;
