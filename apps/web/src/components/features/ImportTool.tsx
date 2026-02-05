'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@bandachao/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

interface ImportToolProps {
  onImport?: (file: File) => Promise<ImportResult>;
}

/**
 * ImportTool - Bulk product import from CSV/Excel
 * 
 * Used in Cockpit for makers to import products in bulk
 */
export default function ImportTool({ onImport }: ImportToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      setResult(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      if (onImport) {
        const importResult = await onImport(file);
        setResult(importResult);
      } else {
        // Mock import for demo
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setResult({
          success: Math.floor(Math.random() * 100 + 50),
          failed: Math.floor(Math.random() * 10),
          errors: [
            { row: 5, message: 'Invalid price format' },
            { row: 12, message: 'Missing required field: SKU' },
            { row: 23, message: 'Duplicate product ID' },
          ],
        });
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="text-panda-500" size={24} />
          Bulk Product Import
        </CardTitle>
        <p className="text-sm text-slate-400 mt-2">
          Upload CSV or Excel file to import multiple products at once
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        {!result && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
              dragActive
                ? 'border-panda-500 bg-panda-500/10'
                : 'border-ink-700 bg-ink-900 hover:border-ink-600'
            }`}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  file ? 'bg-jade-500/20 text-jade-500' : 'bg-ink-800 text-slate-400'
                }`}
              >
                {file ? <CheckCircle size={32} /> : <Upload size={32} />}
              </div>

              {file ? (
                <div>
                  <p className="text-lg font-semibold text-slate-200">{file.name}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-slate-200">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Supported formats: CSV, XLSX, XLS
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Import Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-jade-500/10 border border-jade-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-jade-500" size={20} />
                    <span className="text-sm font-medium text-slate-300">
                      Successfully Imported
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-jade-500">{result.success}</p>
                </div>

                <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="text-danger-500" size={20} />
                    <span className="text-sm font-medium text-slate-300">Failed</span>
                  </div>
                  <p className="text-3xl font-bold text-danger-500">{result.failed}</p>
                </div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="bg-ink-900 border border-ink-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="text-warn-500" size={18} />
                    <h4 className="font-semibold text-slate-200">Import Errors</h4>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-2 bg-ink-850 rounded-lg text-sm"
                      >
                        <span className="text-slate-500 font-mono">Row {error.row}:</span>
                        <span className="text-slate-300">{error.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full py-2 px-4 bg-ink-800 hover:bg-ink-700 text-slate-200 rounded-xl font-medium transition-colors"
              >
                Import Another File
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {file && !result && (
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Start Import'}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              Cancel
            </Button>
          </div>
        )}

        {/* Template Download */}
        <div className="bg-ink-850 border border-ink-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-panda-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-slate-200 mb-1">Need a template?</h4>
              <p className="text-sm text-slate-400 mb-3">
                Download our CSV template with all required fields and formatting guidelines
              </p>
              <button className="text-panda-500 hover:text-panda-400 text-sm font-medium transition-colors">
                Download Template →
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
