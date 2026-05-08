import PDFDocument from 'pdfkit';
import { ICandidate } from '../models/Candidate';

export const generateCandidatePDF = (candidate: ICandidate): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', reject);

    // Add content to PDF
    doc.fontSize(25).text('Candidate Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`First Name: ${candidate.firstName}`);
    doc.text(`Last Name: ${candidate.lastName}`);
    doc.text(`Email: ${candidate.email}`);
    doc.text(`Phone: ${candidate.phone}`);
    doc.text(`Status: ${candidate.status}`);
    doc.text(`Created At: ${candidate.createdAt.toLocaleDateString()}`);

    doc.end();
  });
};
