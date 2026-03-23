
// RichTextEditor.tsx
import React from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Typography } from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extension-placeholder';
import { FontFamily } from '@tiptap/extension-font-family';
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered,
  Link as LinkIcon,
  Table as TableIcon, Columns, Rows, Trash2,
  Undo, Redo,
  Image as ImageIcon
} from 'lucide-react';

// Custom FontSize extension
const FontSize = (Extension as any).create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize,
        renderHTML: (attributes: any) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "...",
  editable = true 
}: RichTextEditorProps) {
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'border-collapse border border-black w-full' },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-edu-red underline cursor-pointer' },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'max-w-full h-auto rounded' },
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Typography,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable,
  });

  if (!editor) return null;

  return (
    <div className="border border-edu-light/30 rounded-[2px] bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-edu-light/10 bg-[#fbfaf8]">
        
        <select 
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="text-[9px] font-bold uppercase bg-white border border-edu-light/30 px-1 py-0.5"
        >
          <option value="">Police</option>
          <option value="Arial">Arial</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Times New Roman">Times</option>
          <option value="Georgia, serif">Georgia</option>
        </select>

        <select 
          onChange={(e) => (editor.chain().focus() as any).setFontSize(e.target.value).run()}
          className="text-[9px] font-bold uppercase bg-white border border-edu-light/30 px-1 py-0.5"
        >
          <option value="">Taille</option>
          {['8pt', '10pt', '12pt', '14pt', '16pt', '18pt', '24pt'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : ''}`}>
          <Bold size={12} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : ''}`}>
          <Italic size={12} />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1 rounded ${editor.isActive('underline') ? 'bg-black text-white' : ''}`}>
          <UnderlineIcon size={12} />
        </button>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="p-1"><AlignLeft size={12} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="p-1"><AlignCenter size={12} /></button>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        <button onClick={() => {
          const color = window.prompt('Couleur (ex: red, #ff0000):');
          if (color) editor.chain().focus().setColor(color).run();
        }} className="p-1"><div className="w-3 h-3 bg-red-500 rounded-full" /></button>
        
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-1 ${editor.isActive('highlight') ? 'bg-yellow-200 rounded' : ''}`}>
          <div className="w-3 h-3 border border-gray-400 bg-yellow-100" />
        </button>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        <button onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className="p-1"><LinkIcon size={12} /></button>
        
        <button onClick={() => {
          const url = window.prompt('Image URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className="p-1"><ImageIcon size={12} /></button>
        
        <div className="flex gap-0.5">
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-1 text-[10px] font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''}`}>H2</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-1 text-[10px] font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : ''}`}>H3</button>
        </div>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 ${editor.isActive('bulletList') ? 'bg-black text-white rounded' : ''}`}><List size={12} /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1 ${editor.isActive('orderedList') ? 'bg-black text-white rounded' : ''}`}><ListOrdered size={12} /></button>

        <div className="w-px h-4 bg-edu-light/30 mx-0.5" />

        {!editor.isActive('table') ? (
          <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-1">
            <TableIcon size={12} />
          </button>
        ) : (
          <div className="flex gap-0.5">
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1" title="Ajouter ligne"><Rows size={10} /></button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1" title="Ajouter colonne"><Columns size={10} /></button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 text-red-500" title="Supprimer tableau"><Trash2 size={10} /></button>
          </div>
        )}

        <div className="flex-1" />
        
        <button onClick={() => editor.chain().focus().undo().run()} className="p-1 opacity-50"><Undo size={12} /></button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-1 opacity-50"><Redo size={12} /></button>
      </div>

      <div className="p-2 min-h-[60px] prose prose-xs max-w-none focus:outline-none text-[13px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}