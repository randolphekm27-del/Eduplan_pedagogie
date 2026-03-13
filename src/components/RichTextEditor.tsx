// RichTextEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
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
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ListChecks,
  Heading1, Heading2, Heading3,
  Link as LinkIcon, Unlink,
  Table as TableIcon, Columns, Rows, Trash2,
  Pilcrow, Highlighter, Palette, Undo, Redo,
  FileText, Image as ImageIcon, Sigma, Sparkles, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '../services/aiService';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Commencez à écrire...",
  editable = true 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-edu-black w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-edu-red underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable,
  });

  const [isRefining, setIsRefining] = React.useState(false);

  const handleAIRefine = async () => {
    if (!editor) return;
    const text = editor.getText();
    if (!text.trim()) return;

    setIsRefining(true);
    try {
      const refined = await aiService.refineText(text, "Améliore la clarté et le ton professionnel de ce contenu pédagogique technique.");
      editor.commands.setContent(refined);
      toast.success('Contenu amélioré par l\'IA !');
    } catch (error) {
      toast.error('Échec de l\'amélioration par l\'IA.');
    } finally {
      setIsRefining(false);
    }
  };

  if (!editor) return null;

  // Fonctions pour les tableaux
  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL de l\'image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addFormula = () => {
    const formula = window.prompt('Formule LaTeX (ex: r = \\frac{U1 - U2}{I2 - I1}):');
    if (formula) {
      editor.chain().focus().insertContent(`<span class="math-formula">$${formula}$</span>`).run();
    }
  };

  // Déterminer si on est dans un tableau
  const isInTable = editor.isActive('table');

  return (
    <div className="border border-edu-light/30 rounded-[2px] bg-white">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-edu-light/30 bg-edu-bg/30">
        {/* Style de texte */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('bold') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Gras (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('italic') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Italique (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('underline') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Souligné (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('strike') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Barré"
        >
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Titres */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Titre 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Titre 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Titre 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Listes */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('bulletList') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Liste à puces"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('orderedList') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Liste numérotée"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('taskList') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Liste de tâches"
        >
          <ListChecks size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Alignement */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Aligné à gauche"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Centré"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Aligné à droite"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Justifié"
        >
          <AlignJustify size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Liens */}
        <button
          onClick={setLink}
          className={`p-1.5 rounded-[2px] transition-colors ${
            editor.isActive('link') ? 'bg-edu-red/10 text-edu-red' : 'hover:bg-edu-light/30 text-edu-dark'
          }`}
          title="Insérer un lien"
        >
          <LinkIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark disabled:opacity-30 disabled:cursor-not-allowed"
          title="Supprimer le lien"
        >
          <Unlink size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Tableaux - seulement si on n'est pas déjà dans un tableau */}
        {!isInTable && (
          <button
            onClick={addTable}
            className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
            title="Insérer un tableau"
          >
            <TableIcon size={16} />
          </button>
        )}

        {/* Outils de tableau (si on est dans un tableau) */}
        {isInTable && (
          <>
            <button
              onClick={addRowAfter}
              className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
              title="Ajouter une ligne après"
            >
              <Rows size={16} />
            </button>
            <button
              onClick={addColumnAfter}
              className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
              title="Ajouter une colonne après"
            >
              <Columns size={16} />
            </button>
            <button
              onClick={deleteRow}
              className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
              title="Supprimer la ligne"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={deleteColumn}
              className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
              title="Supprimer la colonne"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={deleteTable}
              className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-red/10 text-edu-red"
              title="Supprimer le tableau"
            >
              <TableIcon size={16} />
            </button>
          </>
        )}

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* Médias et formules */}
        <button
          onClick={addImage}
          className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
          title="Insérer une image"
        >
          <ImageIcon size={16} />
        </button>
        <button
          onClick={addFormula}
          className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark"
          title="Insérer une formule"
        >
          <Sigma size={16} />
        </button>

        <div className="w-px h-6 bg-edu-light/50 mx-1" />

        {/* IA Magic */}
        <button
          onClick={handleAIRefine}
          disabled={isRefining}
          className={`p-1.5 rounded-[2px] transition-all ${
            isRefining ? 'bg-edu-red/20 text-edu-red animate-pulse' : 'hover:bg-edu-red/10 text-edu-red'
          }`}
          title="Améliorer avec l'IA"
        >
          {isRefining ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark disabled:opacity-30"
          title="Annuler (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-[2px] transition-colors hover:bg-edu-light/30 text-edu-dark disabled:opacity-30"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Zone d'édition */}
      <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}