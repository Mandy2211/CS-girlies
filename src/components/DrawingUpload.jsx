import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DrawingUpload = ({ onUpload }) => {
  const onDrop = useCallback(acceptedFiles => {
    if (onUpload) onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #a7bfff',
        borderRadius: '18px',
        padding: '32px',
        textAlign: 'center',
        background: '#fff',
        boxShadow: '0 2px 12px #b6e2d3',
        cursor: 'pointer',
        marginBottom: '24px'
      }}
    >
      <input {...getInputProps()} />
      {isDragActive
        ? <p>Drop your drawing here...</p>
        : <p>Click or drag a drawing to upload (PNG, JPG, etc.)</p>
      }
    </div>
  );
};

export default DrawingUpload;