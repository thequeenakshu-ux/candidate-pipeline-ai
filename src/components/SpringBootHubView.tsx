import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface SpringFile {
  filename: string;
  category: string;
  language: string;
  code: string;
}

export const SpringBootHubView: React.FC = () => {
  const [files, setFiles] = useState<SpringFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<SpringFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await api.getSpringBootFiles();
        setFiles(data);
        if (data.length > 0) {
          setSelectedFile(data[0]);
        }
      } catch (err) {
        console.error('Failed to load Spring Boot files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-sm space-y-2">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
        <p>Loading enterprise Java Spring Boot & MySQL project source files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Architecture Blueprint & Source Hub
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Spring Boot 3 · JPA / Hibernate · MySQL Architecture
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Production Java Spring Boot service implementations, normalized MySQL DDL schemas, and REST Controllers matching CampusConnect's production design.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      {/* Layered Architecture Flow Diagram */}
      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Production Layered Pipeline Architecture
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <Cpu className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">React Client</div>
            <div className="text-slate-400 font-mono mt-0.5">Vite SPA</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">Spring Security</div>
            <div className="text-slate-400 font-mono mt-0.5">JWT Filter</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <Layers className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">Controllers</div>
            <div className="text-slate-400 font-mono mt-0.5">REST DTOs</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <Code2 className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">Services</div>
            <div className="text-slate-400 font-mono mt-0.5">Matching Engine</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <FileCode className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">Spring Data</div>
            <div className="text-slate-400 font-mono mt-0.5">JPA / Hibernate</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <Database className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="font-bold text-slate-900">MySQL 8.0</div>
            <div className="text-slate-400 font-mono mt-0.5">Normalized DB</div>
          </div>
        </div>
      </div>

      {/* Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Navigator (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Source Code Components
          </div>
          <div className="divide-y divide-slate-100">
            {files.map((file) => {
              const isSelected = selectedFile?.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-indigo-50/70 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate font-mono">{file.filename}</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-sans font-medium shrink-0">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-200 font-semibold">{selectedFile?.filename}</span>
              <span>·</span>
              <span>{selectedFile?.category} Layer</span>
            </div>
            <span className="font-mono text-xs">{selectedFile?.language.toUpperCase()}</span>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[580px]">
            <code>{selectedFile?.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
