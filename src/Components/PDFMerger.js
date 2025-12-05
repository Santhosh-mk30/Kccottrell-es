import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './PDFMerger.css';

function PDFMerger({ onClose }) {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const pdfFiles = selectedFiles.filter(file =>
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );

        if (pdfFiles.length === 0) {
            setMessage('Please select valid PDF files');
            return;
        }

        if (pdfFiles.length < 2) {
            setMessage('Please select at least 2 PDF files to merge');
            return;
        }

        setFiles(pdfFiles);
        setMessage('');
    };

    const mergePDFs = async () => {
        if (files.length < 2) {
            setMessage('Please select at least 2 PDF files');
            return;
        }

        setMerging(true);
        setMessage('Merging PDFs...');

        try {
            // Create a new PDF document
            const mergedPdf = await PDFDocument.create();

            // Loop through each file and add its pages to the merged PDF
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // Serialize the merged PDF to bytes
            const mergedPdfBytes = await mergedPdf.save();

            // Create a blob and download
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged.pdf';
            link.click();
            URL.revokeObjectURL(url);

            setMessage('✅ PDFs merged successfully! File downloaded.');
            setTimeout(() => {
                setFiles([]);
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Merge error:', error);
            setMessage(`❌ Merge failed: ${error.message || 'Please try again'}`);
        } finally {
            setMerging(false);
        }
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        if (newFiles.length < 2) {
            setMessage('Please select at least 2 PDF files to merge');
        }
    };

    return (
        <div className="pdf-overlay" onClick={onClose}>
            <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
                <button className="pdf-close" onClick={onClose}>×</button>

                <h2 className="pdf-title">PDF Merger</h2>
                <p className="pdf-subtitle">Merge multiple PDF files into one</p>

                <div className="pdf-content">
                    <div className="file-upload-area">
                        <input
                            type="file"
                            id="pdfFiles"
                            accept=".pdf,application/pdf"
                            multiple
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <label htmlFor="pdfFiles" className="file-label">
                            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="file-label-text">
                                {files.length > 0 ? `${files.length} PDF(s) selected` : 'Click to select PDF files'}
                            </span>
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="file-list">
                            <h4>Selected Files ({files.length}):</h4>
                            {files.map((file, index) => (
                                <div key={index} className="file-item">
                                    <span className="file-name">📄 {file.name}</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFile(index)}
                                        title="Remove file"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {message && (
                        <p className={`pdf-message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        onClick={mergePDFs}
                        disabled={files.length < 2 || merging}
                        className="merge-button"
                    >
                        {merging ? (
                            <>
                                <span className="spinner"></span>
                                Merging...
                            </>
                        ) : (
                            <>
                                <svg className="merge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Merge PDFs
                            </>
                        )}
                    </button>

                    <div className="pdf-info">
                        <p>ℹ️ Select multiple PDF files to merge</p>
                        <p>📑 Files will be merged in the order selected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PDFMerger;
