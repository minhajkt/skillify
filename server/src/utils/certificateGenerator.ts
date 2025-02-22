import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { cloudinary } from "../config/cloudinaryConfig";

export const generateCertificate = async (
  userName: string,
  courseName: string,
  progressId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = path.join(__dirname, `certificate_${progressId}.pdf`);
      
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
      });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 50;

      doc
        .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
        .lineWidth(2)
        .stroke('#1B365C');

      const curveY1 = margin + 40;
      const curveY2 = pageHeight - margin - 40;
      
      doc
        .moveTo(margin + 50, curveY1)
        .quadraticCurveTo(pageWidth / 2, curveY1 - 20, pageWidth - margin - 50, curveY1)
        .stroke('#1B365C');

      doc
        .moveTo(margin + 50, curveY2)
        .quadraticCurveTo(pageWidth / 2, curveY2 + 20, pageWidth - margin - 50, curveY2)
        .stroke('#1B365C');

        const logoPath = path.join(__dirname, "../public/images/skillify.png"); 
        doc.image(logoPath, pageWidth / 2 - 50, margin + 45, { width: 100 });

      doc
        .font('Helvetica-Bold')
        .fontSize(36)
        .fillColor('#1B365C')
        .text('Certificate of Completion', margin, margin + 80, {
          align: 'center',
          width: pageWidth - margin * 2
        });

      doc
        .font('Helvetica')
        .fontSize(24)
        .text(courseName, margin, margin + 140, {
          align: 'center',
          width: pageWidth - margin * 2
        });

      doc
        .font('Helvetica')
        .fontSize(18)
        .moveDown(1)
        .text('This is to certify that', {
          align: 'center',
          width: pageWidth - margin * 2
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .moveDown(0.5)
        .text(userName, {
          align: 'center',
          width: pageWidth - margin * 2,
          underline: true
        });

      doc
        .font('Helvetica')
        .fontSize(18)
        .moveDown(0.5)
        .text('has successfully completed the course', {
          align: 'center',
          width: pageWidth - margin * 2
        });

      doc
        .font("Helvetica-Oblique")
        .fontSize(16)
        .moveDown(1)
        .text("Demonstrating exceptional skills in projects and practicals", {
          align: "center",
          width: pageWidth - margin * 2,
        });

      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc
        .font('Helvetica')
        .fontSize(14)
        .text(`Date: ${currentDate}`, margin + 50, pageHeight - margin - 120);

        const progressIdShort = progressId.slice(0, 24);
      doc
        .font('Helvetica-Oblique')
        .fontSize(14)
        .text(`CertificateID : ${progressIdShort}`, margin + 50, pageHeight - margin - 100);  

      doc
        .fontSize(14)
        .text('Skillify Academy', pageWidth - margin - 250, pageHeight - margin - 120);

        const signPath = path.join(__dirname, "../public/images/si.png");
        doc.image(signPath, pageWidth - margin - 250, pageHeight - margin - 125, { width: 100 });
      doc.end();

      stream.on("finish", async () => {
        try {
          const uploadedFile = await cloudinary.v2.uploader.upload(pdfPath, {
            folder: "certificates",
            resource_type: "raw",
            format: "pdf",
            access_mode: "authenticated",
            type: "authenticated",
          });

          fs.unlinkSync(pdfPath);
          resolve(uploadedFile.public_id);
        } catch (uploadError) {
          reject(uploadError);
        }
      });
      

      stream.on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

