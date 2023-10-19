import React, { forwardRef, useCallback, useRef } from "react";
import { markAsUploadOptionsComponent, useUploadyContext } from "@rpldy/shared-ui";

import type { ComponentType } from "react";
import type { UploadOptions } from "@rpldy/shared";
import { UploadButtonProps } from '@rpldy/upload-button';

type FileInputProps = {
  capture: string,
  accept: string,
};

const asUploadButton = (Component: ComponentType<any>, InputProps: FileInputProps): any => {
  const AsUploadButton = (props: UploadButtonProps, ref: React.Ref<any>) => {
    const { showFileUpload, getInternalFileInput } = useUploadyContext();
    const { id, className, text, children, extraProps, onClick, ...uploadOptions } = props;

    //using ref so onButtonClick can stay memoized
    const uploadOptionsRef = useRef<UploadOptions>();
    uploadOptionsRef.current = uploadOptions;

    const onButtonClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
      const input = getInternalFileInput();
      input.current.accept = InputProps.accept;
      input.current.capture = InputProps.capture;
      showFileUpload(uploadOptionsRef.current);
      onClick?.(e);
    }, [getInternalFileInput, showFileUpload, uploadOptionsRef, onClick]);

    return <Component
      ref={ref}
      onClick={onButtonClick}
      id={id}
      className={className}
      children={children || text || "Upload"}
      {...extraProps}
    />;
  };

  markAsUploadOptionsComponent(AsUploadButton);

  return forwardRef(AsUploadButton);
};

export default asUploadButton;