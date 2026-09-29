'use client';

import { useEffect, useRef, useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, List, ListOrdered, Minus, Redo2, Undo2, Underline, Unlink } from 'lucide-react';

type Props = { value: string; onChange: (value: string) => void };

const sizes = [
  { label: 'Small', value: '0.9rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.15rem' },
];

function plainTextToHtml(value: string) {
  if (!value) return '<p></p>';
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value.split(/\n\s*\n/).map(block => `<p>${block.trim().replace(/\n/g, '<br>')}</p>`).filter(block => block !== '<p></p>').join('');
}

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState('1rem');

  useEffect(() => {
    if (!ref.current) return;
    const next = plainTextToHtml(value);
    if (ref.current.innerHTML !== next) ref.current.innerHTML = next;
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML || '');
  const command = (name: string, commandValue?: string) => {
    ref.current?.focus();
    document.execCommand(name, false, commandValue);
    emit();
  };
  const setBlock = (tag: string) => {
    ref.current?.focus();
    document.execCommand('formatBlock', false, tag);
    emit();
  };
  const insertLink = () => {
    ref.current?.focus();
    const url = window.prompt('Enter the full link, for example https://bahariasilisafaris.vercel.app/booking or /booking');
    if (!url) return;
    const safe = /^(https?:\/\/|mailto:|tel:|\/)/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    document.execCommand('createLink', false, safe);
    emit();
  };
  const insertBookingLink = (label: string, href: string) => {
    ref.current?.focus();
    document.execCommand('insertHTML', false, `<a href="${href}" class="content-cta">${label}</a>`);
    emit();
  };
  const fontSize = (value: string) => {
    setSize(value);
    ref.current?.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = value;
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
      emit();
    } catch {
      document.execCommand('fontSize', false, '4');
      emit();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50 p-2">
        <select value="" onChange={e => e.target.value && setBlock(e.target.value)} className="h-9 rounded-lg border bg-white px-2 text-xs font-semibold">
          <option value="">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option>
        </select>
        <select value={size} onChange={e => fontSize(e.target.value)} className="h-9 rounded-lg border bg-white px-2 text-xs font-semibold">
          {sizes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button type="button" title="Bold" onClick={() => command('bold')} className="toolbar-btn"><Bold className="h-4 w-4" /></button>
        <button type="button" title="Italic" onClick={() => command('italic')} className="toolbar-btn"><Italic className="h-4 w-4" /></button>
        <button type="button" title="Underline" onClick={() => command('underline')} className="toolbar-btn"><Underline className="h-4 w-4" /></button>
        <button type="button" title="Bullet list" onClick={() => command('insertUnorderedList')} className="toolbar-btn"><List className="h-4 w-4" /></button>
        <button type="button" title="Numbered list" onClick={() => command('insertOrderedList')} className="toolbar-btn"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" title="Align left" onClick={() => command('justifyLeft')} className="toolbar-btn"><AlignLeft className="h-4 w-4" /></button>
        <button type="button" title="Align center" onClick={() => command('justifyCenter')} className="toolbar-btn"><AlignCenter className="h-4 w-4" /></button>
        <button type="button" title="Align right" onClick={() => command('justifyRight')} className="toolbar-btn"><AlignRight className="h-4 w-4" /></button>
        <button type="button" title="Add link" onClick={insertLink} className="toolbar-btn"><Link2 className="h-4 w-4" /></button>
        <button type="button" title="Remove link" onClick={() => command('unlink')} className="toolbar-btn"><Unlink className="h-4 w-4" /></button>
        <button type="button" title="Plan My Safari" onClick={() => insertBookingLink('Plan My Safari', '/booking')} className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-2 text-[11px] font-bold text-cyan-800">Plan My Safari</button>
        <button type="button" title="Contact Us" onClick={() => insertBookingLink('Contact Us', '/contact')} className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-2 text-[11px] font-bold text-orange-800">Contact Us</button>
        <button type="button" title="Undo" onClick={() => command('undo')} className="toolbar-btn ml-auto"><Undo2 className="h-4 w-4" /></button>
        <button type="button" title="Redo" onClick={() => command('redo')} className="toolbar-btn"><Redo2 className="h-4 w-4" /></button>
        <button type="button" title="Clear formatting" onClick={() => command('removeFormat')} className="toolbar-btn"><Minus className="h-4 w-4" /></button>
      </div>
      <style jsx>{`.toolbar-btn{display:inline-flex;height:36px;width:36px;align-items:center;justify-content:center;border-radius:8px}.toolbar-btn:hover{background:#e2e8f0}.content-editor:focus{outline:none}`}</style>
      <div ref={ref} contentEditable suppressContentEditableWarning onInput={emit} className="content-editor min-h-[320px] p-5 text-[16px] leading-8 text-slate-800 focus:ring-2 focus:ring-cyan-100" />
      <div className="border-t bg-slate-50 px-4 py-2 text-[11px] text-slate-500">Use headings for structure, normal paragraphs for body copy, and the booking buttons to insert promotional links.</div>
    </div>
  );
}
