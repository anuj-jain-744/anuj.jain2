import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadDoc from './UploadDoc'
import { useUploadFile } from '../../hooks/useUploadFile'
import useFilesToBase64 from '../../hooks/useFilesToBase64'

jest.mock('../../hooks/useUploadFile')
jest.mock('../../hooks/useFilesToBase64')

jest.mock('./FileList', () => ({
  __esModule: true,
  default: ({ files, onRemove }) => (
    <div data-testid="file-list">
      {files.map((file, index) => (
        <div key={index} data-testid={`file-${index}`}>
          {file.name}
          <button onClick={() => onRemove(index)}>Remove</button>
        </div>
      ))}
    </div>
  ),
}))

jest.mock('./UploadButton', () => ({
  __esModule: true,
  default: ({ handleFileChange }) => (
    <button onClick={() => handleFileChange({ target: { files: [new File([''], 'test.pdf')] } })}>
      Upload
    </button>
  ),
}))

jest.mock('../../utils/BaseButton', () => ({
  __esModule: true,
  default: ({ title, onClickhandler, isDisabled }) => (
    <button onClick={onClickhandler} disabled={isDisabled}>
      {title}
    </button>
  ),
}))

describe('UploadDoc', () => {
  const mockHandleSuccess = jest.fn()
  const mockLanguageData = {
    upload_the_supporting_docs: 'Upload Supporting Documents',
    supported_formats: 'Supported Formats',
    upload_accident_report: 'Upload Accident Report',
    uploading: 'Uploading',
    submit: 'Submit',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUploadFile as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue({ status: 'OK' }),
      isLoading: false,
    })
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [],
      setFileData: jest.fn(),
      convertFilesToBase64: jest.fn(),
    })
  })

  it('renders the UploadDoc component', () => {
    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    expect(screen.getByText('Upload Supporting Documents')).toBeInTheDocument()
    expect(screen.getByText('Supported Formats')).toBeInTheDocument()
    expect(screen.getByText('Upload Accident Report')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('displays uploaded files', () => {
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [{ name: 'test1.pdf' }, { name: 'test2.pdf' }],
      setFileData: jest.fn(),
      convertFilesToBase64: jest.fn(),
    })

    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    expect(screen.getByTestId('file-0')).toHaveTextContent('test1.pdf')
    expect(screen.getByTestId('file-1')).toHaveTextContent('test2.pdf')
  })

  it('removes a file when remove button is clicked', () => {
    const mockSetFileData = jest.fn()
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [{ name: 'test1.pdf' }, { name: 'test2.pdf' }],
      setFileData: mockSetFileData,
      convertFilesToBase64: jest.fn(),
    })

    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    fireEvent.click(screen.getAllByText('Remove')[0])

    expect(mockSetFileData).toHaveBeenCalled()
  })

  it('submits files and calls handleSuccess on successful upload', async () => {
    const mockMakeApiCall = jest.fn().mockResolvedValue({ status: 'OK' })
    ;(useUploadFile as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
    })
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [{ name: 'test.pdf' }],
      setFileData: jest.fn(),
      convertFilesToBase64: jest.fn(),
    })

    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockMakeApiCall).toHaveBeenCalled()
      expect(mockHandleSuccess).toHaveBeenCalledWith(true)
    })
  })

  it('disables submit button when no files are uploaded', () => {
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [],
      setFileData: jest.fn(),
      convertFilesToBase64: jest.fn(),
    })

    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    expect(screen.getByText('Submit')).toBeDisabled()
  })

  it('shows loading state when uploading', () => {
    ;(useUploadFile as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: true,
    })
    ;(useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: [{ name: 'test.pdf' }],
      setFileData: jest.fn(),
      convertFilesToBase64: jest.fn(),
    })

    render(<UploadDoc handleSuccess={mockHandleSuccess} languageData={mockLanguageData} />)

    expect(screen.getByText('Uploading')).toBeInTheDocument()
    expect(screen.getByText('Uploading')).toBeDisabled()
  })
})