'use client';

import {useState, useRef} from 'react';
import {Upload, Loader2} from 'lucide-react';

const Import = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      // Add your file upload logic here
      // When done, set setIsUploading(false)
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center mt-40">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".xlsx,.xls" />

      {!isUploading ? (
        <div
          onClick={handleClick}
          className="cursor-pointer w-[40%] flex items-center justify-center gap-2 bg-orange-600 py-8 px-12 text-3xl font-bold text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Upload className="text-4xl" />
          Importer le stock
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-[40%] flex flex-col items-center gap-4">
          <Loader2 className="text-8xl h-20 w-20 text-orange-600 animate-spin" />
          <p className="text-gray-600 text-xl font-medium">Importing: {selectedFile?.name}...</p>
        </div>
      )}
    </div>
  );
};

export default Import;
