import React, { PropsWithChildren } from 'react';

interface UploadProps {
  type?: string,
  accept?: string,
  onChange?: (files: HTMLInputElement | File) => void,
}

export function useUploadElement<
  T extends UploadProps
>(props:PropsWithChildren<T>):React.ReactElement {
  const {
    children,
    type,
    accept,
    onChange,
  } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length > 0) {
      const { files } = e.target;
      const options = {
        type: files[0].type,
      };
      const file = new File(files as any, files[0].name, options);
      onChange(file);
    }
    e.target.value = '';
  };
  return (
    <div className="upload-picker">
      <main className="upload-picker-content">{children}</main>
      <input title="图片" type="file" data-type={type} accept={accept} onChange={handleChange} />
    </div>
  );
}
