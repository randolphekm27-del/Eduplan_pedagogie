import React from 'react';
import RichTextEditor from './RichTextEditor';
import { Trash2 } from 'lucide-react';

interface SectionEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  isProtected?: boolean;
}

export default function SectionEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onDelete,
  isProtected = false
}: SectionEditorProps) {
  return (
    <div className="mb-8 p-4 -mx-2 rounded-[2px] border border-transparent hover:border-edu-light transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-serif text-lg font-bold text-edu-black uppercase bg-transparent outline-none flex-1"
        />
        {!isProtected && (
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-edu-dark hover:text-edu-red transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <RichTextEditor
        content={content}
        onChange={onContentChange}
      />
    </div>
  );
}
