import cloudinary from "cloudinary";

export const uploadCertificates = async (
  certificates: Express.Multer.File[]
): Promise<string[]> => {
  const certificatesUrls: string[] = [];
  if (!certificates || certificates.length === 0) return certificatesUrls;

  await Promise.all(
    certificates.map((certificate) => {
      return new Promise<void>((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          certificate.path,
          { folder: "tutor_certificates", resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(
                new Error(`Error uploading certificate: ${error.message}`)
              );
            } else if (result) {
              certificatesUrls.push(result.secure_url);
              resolve();
            }
          }
        );
      });
    })
  );

  return certificatesUrls;
};
