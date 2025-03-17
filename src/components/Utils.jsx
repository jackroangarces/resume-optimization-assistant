// utils.js
import html2pdf from 'html-to-pdf-js';
import * as docxPreview from 'docx-preview';

export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const generatePdfFromDocx = async (docxBlob) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await docxPreview.renderAsync(docxBlob, container);
    const pdfBlob = await html2pdf().from(container.outerHTML).set({
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // Adjust page size and orientation
    }).outputPdf('blob');
    document.body.removeChild(container);
    return blobToBase64(pdfBlob);
};

export const base64ToBlob = (base64Data, type) => {
    const base64Content = base64Data.split('base64,')[1];
    const byteCharacters = atob(base64Content) ;
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = Array.from(slice).map(char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    if (type === "pdf") {
        return new Blob(byteArrays, { type: 'application/pdf' });
    } else {
        return new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    }
};