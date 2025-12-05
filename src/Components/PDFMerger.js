import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import './PDFMerger.css';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PDFMerger({ onClose }) {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [message, setMessage] = useState('');
    const [previews, setPreviews] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const generatePreview = async (file, index) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            // Generate thumbnail using PDF.js
            let thumbnailUrl = null;
            try {
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const scale = 0.5;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                thumbnailUrl = canvas.toDataURL();
            } catch (err) {
                console.log('Thumbnail generation failed:', err);
            }

            return {
                id: `file-${index}-${Date.now()}`,
                file: file,
                name: file.name,
                pageCount: pageCount,
                index: index,
                thumbnail: thumbnailUrl
            };
        } catch (error) {
            console.error('Preview generation error:', error);
            return {
                id: `file-${index}-${Date.now()}`,
                file: file,
                name: file.name,
                pageCount: 0,
                index: index,
                thumbnail: null
            };
        }
    };

    const handleFileChange = async (e) => {
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

        setMessage('Loading previews...');

        const previewPromises = pdfFiles.map((file, index) => generatePreview(file, index));
        const generatedPreviews = await Promise.all(previewPromises);

        setFiles(pdfFiles);
        setPreviews(generatedPreviews);
        setMessage('');
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex) => {
        if (draggedIndex === null) return;

        const items = Array.from(previews);
        const [draggedItem] = items.splice(draggedIndex, 1);
        items.splice(dropIndex, 0, draggedItem);

        setPreviews(items);
        const reorderedFiles = items.map(preview => preview.file);
        setFiles(reorderedFiles);
        setDraggedIndex(null);
    };

    const mergePDFs = async () => {
        if (files.length < 2) {
            setMessage('Please select at least 2 PDF files');
            return;
        }

        setMerging(true);
        setMessage('Merging PDFs...');

        try {
            const mergedPdf = await PDFDocument.create();

            for (const preview of previews) {
                const arrayBuffer = await preview.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
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
                setPreviews([]);
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Merge error:', error);
            setMessage(`❌ Merge failed: ${error.message || 'Please try again'}`);
        } finally {
            setMerging(false);
        }
    };

    const removeFile = (id) => {
        const newPreviews = previews.filter(preview => preview.id !== id);
        const newFiles = newPreviews.map(preview => preview.file);

        setPreviews(newPreviews);
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
                <p className="pdf-subtitle">Merge multiple PDF files - Drag to reorder</p>

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

                    {previews.length > 0 && (
                        <div className="preview-container">
                            <h4 className="preview-heading">📄 Drag to reorder files:</h4>
                            <div className="file-list-draggable">
                                {previews.map((preview, index) => (
                                    <div
                                        key={preview.id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        className={`file-item-preview ${draggedIndex === index ? 'dragging' : ''}`}
                                    >
                                        <div className="file-preview-content">
                                            <div className="drag-handle">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                                                </svg>
                                            </div>
                                            {preview.thumbnail ? (
                                                <img
                                                    src={preview.thumbnail}
                                                    alt="PDF Preview"
                                                    className="file-thumbnail"
                                                />
                                            ) : (
                                                <div className="file-icon">📄</div>
                                            )}
                                            <div className="file-details">
                                                <span className="file-name-preview">{preview.name}</span>
                                                <span className="file-pages">{preview.pageCount} page{preview.pageCount !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="file-order">#{index + 1}</div>
                                            <button
                                                className="remove-btn-preview"
                                                onClick={() => removeFile(preview.id)}
                                                title="Remove file"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                        <p>🔄 Drag files to change merge order</p>
                        <p>📑 Files will be merged in displayed order</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PDFMerger;
