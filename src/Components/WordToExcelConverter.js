import React, { useState } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import './WordToExcelConverter.css';

function WordToExcelConverter({ onClose }) {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc')) {
                setFile(selectedFile);
                setMessage('');
            } else {
                setMessage('Please select a valid Word document (.doc or .docx)');
                setFile(null);
            }
        }
    };

    const convertToExcel = async () => {
        if (!file) {
            setMessage('Please select a file first');
            return;
        }

        setConverting(true);
        setMessage('Converting...');

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Extract text from Word document using mammoth
            const result = await mammoth.extractRawText({ arrayBuffer });
            const text = result.value;

            if (!text || text.trim() === '') {
                setMessage('❌ No content found in the document');
                setConverting(false);
                return;
            }

            // Split text into lines
            const lines = text.split('\n').filter(line => line.trim() !== '');

            // Create Excel data - each line becomes a row
            const excelData = [];

            lines.forEach(line => {
                // Try to detect if line has multiple columns (separated by tabs, commas, or multiple spaces)
                if (line.includes('\t')) {
                    // Tab-separated
                    excelData.push(line.split('\t').map(cell => cell.trim()));
                } else if (line.includes(',') && line.split(',').length > 2) {
                    // Comma-separated (likely CSV-like)
                    excelData.push(line.split(',').map(cell => cell.trim()));
                } else if (line.match(/\s{2,}/)) {
                    // Multiple spaces
                    excelData.push(line.split(/\s{2,}/).map(cell => cell.trim()));
                } else {
                    // Single column
                    excelData.push([line.trim()]);
                }
            });

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(excelData);

            // Auto-size columns
            const maxWidth = excelData.reduce((max, row) => {
                return Math.max(max, ...row.map(cell => String(cell).length));
            }, 10);

            ws['!cols'] = [{ wch: Math.min(maxWidth, 50) }];

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Generate Excel file
            const fileName = file.name.replace(/\.(docx?|DOCX?)$/, '.xlsx');
            XLSX.writeFile(wb, fileName);

            setMessage('✅ Conversion successful! File downloaded.');
            setTimeout(() => {
                setFile(null);
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Conversion error:', error);
            setMessage(`❌ Conversion failed: ${error.message || 'Please try again'}`);
        } finally {
            setConverting(false);
        }
    };

    return (
        <div className="converter-overlay" onClick={onClose}>
            <div className="converter-modal" onClick={(e) => e.stopPropagation()}>
                <button className="converter-close" onClick={onClose}>×</button>

                <h2 className="converter-title">Word to Excel Converter</h2>
                <p className="converter-subtitle">Convert your Word documents to Excel format</p>

                <div className="converter-content">
                    <div className="file-upload-area">
                        <input
                            type="file"
                            id="wordFile"
                            accept=".doc,.docx"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <label htmlFor="wordFile" className="file-label">
                            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="file-label-text">
                                {file ? file.name : 'Click to select Word document'}
                            </span>
                        </label>
                    </div>

                    {message && (
                        <p className={`converter-message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        onClick={convertToExcel}
                        disabled={!file || converting}
                        className="convert-button"
                    >
                        {converting ? (
                            <>
                                <span className="spinner"></span>
                                Converting...
                            </>
                        ) : (
                            <>
                                <svg className="convert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Convert to Excel
                            </>
                        )}
                    </button>

                    <div className="converter-info">
                        <p>ℹ️ Supported formats: .doc, .docx</p>
                        <p>📊 Output format: .xlsx (Excel)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordToExcelConverter;
