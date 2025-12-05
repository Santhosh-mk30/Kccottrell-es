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

            // Extract both raw text and HTML from Word document
            const [textResult, htmlResult] = await Promise.all([
                mammoth.extractRawText({ arrayBuffer }),
                mammoth.convertToHtml({ arrayBuffer })
            ]);

            const text = textResult.value;
            const html = htmlResult.value;

            if (!text || text.trim() === '') {
                setMessage('❌ No content found in the document');
                setConverting(false);
                return;
            }

            let excelData = [];

            // Try to detect and extract tables from HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const tables = doc.querySelectorAll('table');

            if (tables.length > 0) {
                // Document has tables - extract table data
                tables.forEach((table, tableIndex) => {
                    if (tableIndex > 0) {
                        // Add empty row between tables
                        excelData.push([]);
                    }

                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td, th');
                        const rowData = Array.from(cells).map(cell => cell.textContent.trim());
                        if (rowData.some(cell => cell !== '')) {
                            excelData.push(rowData);
                        }
                    });
                });
            } else {
                // No tables - parse text content
                const lines = text.split('\n').filter(line => line.trim() !== '');

                lines.forEach(line => {
                    const trimmedLine = line.trim();

                    // Detect different separators
                    if (trimmedLine.includes('\t')) {
                        // Tab-separated
                        excelData.push(trimmedLine.split('\t').map(cell => cell.trim()));
                    } else if (trimmedLine.match(/\s{3,}/)) {
                        // Multiple spaces (3 or more)
                        excelData.push(trimmedLine.split(/\s{3,}/).map(cell => cell.trim()));
                    } else if (trimmedLine.includes('|')) {
                        // Pipe-separated
                        excelData.push(trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell !== ''));
                    } else if (trimmedLine.match(/,\s+/)) {
                        // Comma with space (likely CSV-like)
                        const parts = trimmedLine.split(/,\s+/);
                        if (parts.length > 1) {
                            excelData.push(parts.map(cell => cell.trim()));
                        } else {
                            excelData.push([trimmedLine]);
                        }
                    } else if (trimmedLine.includes(':')) {
                        // Key-value pairs (e.g., "Name: John")
                        const parts = trimmedLine.split(':');
                        if (parts.length === 2) {
                            excelData.push([parts[0].trim(), parts[1].trim()]);
                        } else {
                            excelData.push([trimmedLine]);
                        }
                    } else {
                        // Single column
                        excelData.push([trimmedLine]);
                    }
                });
            }

            if (excelData.length === 0) {
                setMessage('❌ No data could be extracted from the document');
                setConverting(false);
                return;
            }

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(excelData);

            // Auto-size columns based on content
            const colWidths = [];
            excelData.forEach(row => {
                row.forEach((cell, colIndex) => {
                    const cellLength = String(cell).length;
                    if (!colWidths[colIndex] || cellLength > colWidths[colIndex]) {
                        colWidths[colIndex] = cellLength;
                    }
                });
            });

            ws['!cols'] = colWidths.map(width => ({ wch: Math.min(Math.max(width + 2, 10), 50) }));

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
                        <p>ℹ️ Supports: .doc, .docx with tables</p>
                        <p>📊 Output: .xlsx (Excel)</p>
                        <p>✨ Auto-detects tables & formatting</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordToExcelConverter;
