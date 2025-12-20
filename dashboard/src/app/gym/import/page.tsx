"use client";

import { useState } from 'react';

export default function ImportPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Import Members</h1>
                <p className="text-gray-500 mt-2">Bulk create accounts using Excel. AI will generate codes for them.</p>
            </div>

            {/* Step 1: Download Template */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-gray-900">Step 1: Get the Template</h3>
                    <p className="text-sm text-gray-500">Download our formatted Excel sheet to avoid errors.</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                    Download .XLSX
                </button>
            </div>

            {/* Step 2: Upload */}
            <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                        📂
                    </div>

                    {file ? (
                        <div>
                            <p className="text-lg font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Process Import
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                className="mt-4 ml-3 px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-xl font-medium text-gray-700">Drag & Drop your Excel file here</p>
                            <p className="text-gray-500">or</p>
                            <label className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 text-gray-700 font-medium">
                                Browse Files
                                <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".xlsx,.csv" />
                            </label>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
