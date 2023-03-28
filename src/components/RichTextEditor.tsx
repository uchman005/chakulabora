import dynamic from 'next/dynamic'
import parse from 'html-react-parser'
import { useState } from 'react'
import 'quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

// getContents(index: Number = 0, length: Number = remaining): Delta
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'font',
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]
const placeholder = "Start Editing, Please be as detailed as possible. You can Use Images to further describe your point."
const scrollingContainer = "auto-grow"
export default function RichTextEditor() {
  const [value, setValue] = useState('');
  return (
    <div>
      <QuillNoSSRWrapper
        modules={modules}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        formats={formats}
        theme="snow"
        scrollingContainer={scrollingContainer}
      />
      <p>{value}</p>
      {parse(value)}
    </div>
  )
}