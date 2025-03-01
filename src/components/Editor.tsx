
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  content: string;
  onChange?: (content: string) => void;
}

interface EditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ content, onChange }, ref) => {
  const [value, setValue] = useState("");
  
  useEffect(() => {
    setValue(content || "");
  }, [content]);
  
  useImperativeHandle(ref, () => ({
    getContent: () => value,
    setContent: (newContent) => setValue(newContent)
  }));
  
  const handleChange = (newContent: string) => {
    setValue(newContent);
    if (onChange) onChange(newContent);
  };
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'code-block'
  ];
  
  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="min-h-[300px]"
      />
      <style>
        {`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.5;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          border-top: none;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
        `}
      </style>
    </div>
  );
});

Editor.displayName = "Editor";

export default Editor;
