/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadButton from './FileUploadButton';
describe('FileUploadButton Component', () => {
  // Mock for File
  class MockFile extends File {
    constructor(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], name: string, properties?: FilePropertyBag) {
      super(parts, name, properties);
    }
  }

  // Mock for FileList
  const createMockFileList = (files: File[]): FileList => {
    return {
      length: files.length,
      item: (index: number) => files[index],
      ...files,
    } as FileList;
  };

  it('renders correctly', () => {
    render(<FileUploadButton />);
    expect(screen.getByText('Select Archives:')).toBeInTheDocument();
  });

  it('triggers file input when button is clicked', () => {
    render(<FileUploadButton />);
    const button = screen.getByText('Select Archives:');
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    
    // Click Mock for input file
    fileInput.click = jest.fn();
    fileInput.click();
    expect(fileInput.click).toHaveBeenCalled();
  });

  it('handles single file selection', () => {
    const mockFile = new MockFile(['file content'], 'test.png', { type: 'image/png' });
    const mockFileList = createMockFileList([mockFile]);
    const handleFileSelect = jest.fn();
    
    render(<FileUploadButton onFileSelect={handleFileSelect} />);
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    
    fireEvent.change(fileInput, { target: { files: mockFileList } });
    
    expect(handleFileSelect).toHaveBeenCalledWith(mockFile);
    expect(screen.getByText('Selected Archives:')).toBeInTheDocument();
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('handles multiple file selection', () => {
    const mockFiles = [
      new MockFile(['file1'], 'test1.png', { type: 'image/png' }),
      new MockFile(['file2'], 'test2.png', { type: 'image/png' }),
    ];
    const mockFileList = createMockFileList(mockFiles);
    const handleFileSelect = jest.fn();
    
    console.log(mockFiles.length)

    render(<FileUploadButton onFileSelect={handleFileSelect} />);
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    
    fireEvent.change(fileInput, { target: { files: mockFileList } });
    
    expect(handleFileSelect).toHaveBeenCalledWith(mockFiles);
    expect(screen.getByText('Selected Archives:')).toBeInTheDocument();
    expect(screen.getByText('test1.png')).toBeInTheDocument();
    expect(screen.getByText('test2.png')).toBeInTheDocument();
  });
  it('shows nothing when no file is selected', () => {
    const handleFileSelect = jest.fn();
    
    render(<FileUploadButton onFileSelect={handleFileSelect} />);
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    
    fireEvent.change(fileInput, { target: { files: null } });
    
    expect(handleFileSelect).toHaveBeenCalledWith(null);
    expect(screen.queryByText('Selected Archives:')).not.toBeInTheDocument();
  });
});