import { ipcRenderer } from 'electron';
import React, { useState, useRef, ChangeEvent } from 'react';
import styles from './FileUploadButton.module.scss';
import * as fs from 'fs';


const allowedTypes: string = '*';

interface FileUploadButtonProps {
  onFileSelect?: (file: File | File[] | null) => void;
  isMultiple?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  isMultiple = false,
  onFileSelect,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      if (onFileSelect) onFileSelect(null);
      return;
    }

    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);
    if (onFileSelect) {
      isMultiple = filesArray.length > 1;
      onFileSelect(isMultiple ? filesArray : filesArray[0]);
    }

    console.log('Arquivos selecionados:', filesArray);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={allowedTypes}
        data-testid="file-input"
      />
      
      <button 
        onClick={handleButtonClick}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s',
        }}
      >
        {'Select Archives:'}
      </button>
      
      {selectedFiles && (
        <div style={{ marginTop: '10px' }}>
          <p>{'Selected Archives:'}</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {selectedFiles.map((file, index) => (
              <li key={index} style={{ margin: '5px 0' }}>
                <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;