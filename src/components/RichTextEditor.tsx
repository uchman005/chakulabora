"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Quill touches `document`, so it only renders in the browser.
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <p role="status" className="rounded-md border border-gray-300 p-4 text-gray-600">
      Loading editor...
    </p>
  ),
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

// Quill 2 merged "bullet" into "list".
const formats = ["font", "header", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "indent", "link"];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible name for the editable area. */
  label: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, label, className }: RichTextEditorProps) {
  return (
    <div className={`bg-white ${className ?? ""}`} aria-label={label} role="group">
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
