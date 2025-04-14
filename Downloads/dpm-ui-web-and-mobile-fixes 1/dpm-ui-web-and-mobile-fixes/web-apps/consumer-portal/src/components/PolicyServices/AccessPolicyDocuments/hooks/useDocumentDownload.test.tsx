import { renderHook, act } from '@testing-library/react-hooks'
import { useDocumentDownload } from './useDocumentDownload'
import type { PDFDataStructure } from 'types/policyDocuments'

const mockCreateZip = jest.fn()

URL.createObjectURL = jest.fn()
URL.revokeObjectURL = jest.fn()

document.createElement = jest.fn()
document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()

describe('useDocumentDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should download documents successfully', async () => {
    const mockPdfData: any = {
      endorsementData: [{ name: 'endorsement.pdf', document: new Blob() }],
      policyData: [{ name: 'policy.pdf', document: new Blob() }],
      quotationData: [],
      claimsData: []
    }

    const mockZipContent = new Blob(['fake zip content'])
    mockCreateZip.mockResolvedValue(mockZipContent)

    const mockUrl = 'blob:fake-url'
    jest.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl)

    const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
    }
    document.createElement.mockReturnValue(mockAnchor)

    const { result } = renderHook(() => useDocumentDownload(mockCreateZip))

    await act(async () => {
      await result.current.downloadDocuments(mockPdfData)
    })

    expect(mockCreateZip).toHaveBeenCalledWith([
      { name: 'endorsement.pdf', data: expect.any(Blob) },
      { name: 'policy.pdf', data: expect.any(Blob) }
    ])

    expect(URL.createObjectURL).toHaveBeenCalledWith(mockZipContent)
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockAnchor.href).toBe(mockUrl)
    expect(mockAnchor.download).toBe('documents.zip')
    expect(mockAnchor.click).toHaveBeenCalled()
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor)
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl)
  })

  it('should handle empty document list', async () => {
    const mockPdfData: PDFDataStructure = {
      endorsementData: [],
      policyData: [],
      quotationData: [],
      claimsData: []
    }

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    const { result } = renderHook(() => useDocumentDownload(mockCreateZip))

    await act(async () => {
      await result.current.downloadDocuments(mockPdfData)
    })

    expect(consoleSpy).toHaveBeenCalledWith('No PDF data available to download.')
    expect(mockCreateZip).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle error when creating zip file', async () => {
    const mockPdfData: any = {
      endorsementData: [{ name: 'endorsement.pdf', document: new Blob() }],
      policyData: [],
      quotationData: [],
      claimsData: []
    }

    const mockError = new Error('Zip creation failed')
    mockCreateZip.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = renderHook(() => useDocumentDownload(mockCreateZip))

    await act(async () => {
      await expect(result.current.downloadDocuments(mockPdfData)).rejects.toThrow('Failed to download documents')
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error creating zip file:', mockError)

    consoleSpy.mockRestore()
  })
})