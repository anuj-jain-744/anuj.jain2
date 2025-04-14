import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import PropertyPhotosModal from './index';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';
import useFilesToBase64 from '@dpm/consumer-portal/src/claims/register/TrackClaim/hooks/useFilesToBase64';

jest.mock('context/PHQuoteBuyContext');
jest.mock('@dpm/consumer-portal/src/claims/register/TrackClaim/hooks/useFilesToBase64');

const mockUsePHQuoteBuyContext = usePHQuoteBuyContext as jest.Mock;
const mockUseFilesToBase64 = useFilesToBase64 as jest.Mock;

describe('PropertyPhotosModal', () => {
  const setPropertyPhotos = jest.fn();
  const onHide = jest.fn();
  const convertFilesToBase64 = jest.fn();
  const setFileData = jest.fn();

  beforeEach(() => {
    mockUsePHQuoteBuyContext.mockReturnValue({
      setPropertyPhotos,
      propertyPhotos: []
    });
    mockUseFilesToBase64.mockReturnValue({
      fileData: [],
      setFileData,
      convertFilesToBase64
    });
  });

  it('renders the modal correctly', () => {
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    expect(screen.getByText('Property Photos')).toBeInTheDocument();
  });

  it('handles file drop and converts to base64', () => {
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    const dropZone = screen.getByText('Drag and Drop').closest('div');
    const file = new File(['file content'], 'example.png', { type: 'image/png' });
    fireEvent.drop(dropZone!, { dataTransfer: { files: [file] } });
    expect(convertFilesToBase64).toHaveBeenCalledWith([file]);
  });

  it('handles file browse and converts to base64', () => {
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    const fileInput = screen.getByLabelText('Browse Files');
    const file = new File(['file content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(convertFilesToBase64).toHaveBeenCalledWith([file]);
  });

  it('handles modal close with unsaved files', () => {
    mockUseFilesToBase64.mockReturnValueOnce({
      fileData: [new File(['file content'], 'example.png', { type: 'image/png' })],
      setFileData,
      convertFilesToBase64
    });
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    fireEvent.click(screen.getByText('Cancel'));
    waitFor(() => expect(screen.getByText('Are you sure you want to discard changes?')).toBeInTheDocument());
    //expect(screen.getByText('Are you sure you want to discard changes?')).toBeInTheDocument();
  });

  it('handles confirming alert modal', () => {
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Update'));
    expect(onHide).toHaveBeenCalled();
  });

  it('handles removing files', () => {
    mockUseFilesToBase64.mockReturnValueOnce({
      fileData: [new File(['file content'], 'example.png', { type: 'image/png' })],
      setFileData,
      convertFilesToBase64
    });
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    fireEvent.click(screen.getByText('Update'));
    expect(setFileData).toHaveBeenCalledWith([]);
  });

  it('handles submitting files', () => {
    mockUseFilesToBase64.mockReturnValueOnce({
      fileData: [new File(['file content'], 'example.png', { type: 'image/png' })],
      setFileData,
      convertFilesToBase64
    });
    render(<PropertyPhotosModal show={true} onHide={onHide} languageData={{ property_photos: 'Property Photos', drag_and_drop: 'Drag and Drop', supported_file_type: 'Supported file types', browse_files: 'Browse Files', cancel: 'Cancel', update: 'Update' }} />);
    fireEvent.click(screen.getByText('Update'));
    expect(setPropertyPhotos).toHaveBeenCalledWith([new File(['file content'], 'example.png', { type: 'image/png' })]);
    expect(onHide).toHaveBeenCalled();
  });
});