import streamifier from 'streamifier';
import cloudinary from './cloudinary.config';

export interface UploadedFile {
  url: string;
  pub_id: string;
}

export const uploadStreamToCloudinary = (
  stream: NodeJS.ReadableStream,
  folder: string,
  resourceType: 'auto' | 'image' | 'video' = 'auto',
): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, pub_id: result.public_id });
      },
    );
    stream.pipe(uploadStream);
  });
};

export async function uploadFilesToCloudinary(
  files: Express.Multer.File | Express.Multer.File[],
  folder: string,
): Promise<(UploadedFile | null)[] | (UploadedFile | null)> {
  const fileArray = Array.isArray(files) ? files : [files];

  // Upload each file with stream
  const uploads = await Promise.all(
    fileArray.map(async (file) => {
      if (!file) return null;

      const { mimetype } = file;

      const resourceType = mimetype.startsWith('video') ? 'video' : 'image';

      // Stream the buffer directly to Cloudinary
      return uploadStreamToCloudinary(
        streamifier.createReadStream(file.buffer),
        folder,
        resourceType,
      );
    }),
  );

  const cleanUploads = uploads.filter(Boolean);

  return Array.isArray(files)
    ? cleanUploads
    : cleanUploads
      ? cleanUploads?.[0]
      : null;
}

export async function uploadFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
) {
  // Upload each file with stream

  if (!file) return null;

  const { mimetype } = file;

  const resourceType = mimetype.startsWith('video') ? 'video' : 'image';

  // Stream the buffer directly to Cloudinary
  return uploadStreamToCloudinary(
    streamifier.createReadStream(file.buffer),
    folder,
    resourceType,
  );
}
