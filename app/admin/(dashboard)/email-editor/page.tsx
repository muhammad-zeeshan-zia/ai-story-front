'use client'; 

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// 1. Dynamically import the new Quill library (Disables SSR to prevent crashes)
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p style={{ padding: '20px' }}>Loading editor...</p> 
});

// 2. Import the styling theme
import 'react-quill-new/dist/quill.snow.css';

// 3. Define modules and formats OUTSIDE the component 
// (This prevents the typing formatting bug you originally asked about)
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']                                         
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet'
  ,'link'
];

export default function EmailEditorPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  return (
    <main className="w-full p-6 sm:p-10">
      <div className="w-full bg-white rounded-xl p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-[#1e293b]">Email Editor</h1>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2b4e7e] to-[#1D3557] hover:from-[#1D3557] hover:to-[#192e4b] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v12a2 2 0 01-2 2z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-8H7v8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v4h8" />
          </svg>
          Save Changes
        </button>
      </div>

      <div className="w-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label
              htmlFor="emailSubject"
              className="text-sm font-semibold text-gray-600 shrink-0"
            >
              Subject:
            </label>
            <input
              id="emailSubject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your Email Subject Here"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-gray-300 transition-all duration-200"
            />
          </div>

          <div className="custom-quill-container rounded-xl border border-gray-200 overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          </div>
        </div>
      </div>
    </main>
  );
}