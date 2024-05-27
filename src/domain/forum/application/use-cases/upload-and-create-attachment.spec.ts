import { UploadAndCreateAttachmentsUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentsUseCase

describe('Upload and Create Attachments', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentsUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })
  it('should be able upload and create attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads.length).toBe(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({ fileName: 'profile.png' }),
    )
  })
  it('should not be able to upload and create an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.m3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
