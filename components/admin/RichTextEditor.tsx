'use client';

import { useEffect, useRef, useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Link2, List, ListOrdered, Minus, Redo2, Underline, Unlink, Undo2 } from 'lucide-react';

type Props = { value: string; onChange: (value: string) => void };

const blocks = [['p','Body'],['h1','H1'],['h2','H2'],['h3','H3'],['blockquote','Quote']];
const sizes = [['0.9rem','Small'],['1rem','Normal'],['1.15rem','Large']];

function normalize(value: string) {
  if (!value) return '<p><br></p>';
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value.split(/\n\s*\n/).map(x => '<p>' + x.trim().replace(/\n/g, '<br>') + '</p>').join('');
}

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<Range | null>(null);
  const lastValue = useRef(value);
  const [block, setBlock] = useState('p');
  const [size, setSize] = useState('1rem');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState('left');

  useEffect(() => {
    if (!ref.current || value === lastValue.current) return;
    const html = normalize(value);
    if (ref.current.innerHTML !== html) ref.current.innerHTML = html;
    lastValue.current = value;
  }, [value]);

  const saveRange = () => {
    const s = window.getSelection();
    if (s && s.rangeCount && ref.current?.contains(s.anchorNode)) rangeRef.current = s.getRangeAt(0).cloneRange();
  };

  const restoreRange = () => {
    const s = window.getSelection();
    if (!s || !ref.current) return;
    ref.current.focus();
    if (rangeRef.current) { s.removeAllRanges(); s.addRange(rangeRef.current); }
  };

  const sync = () => {
    const s = window.getSelection();
    const node = s?.anchorNode;
    const el = node instanceof HTMLElement ? node : node?.parentElement;
    const current = el?.closest('p,h1,h2,h3,blockquote,li,span') as HTMLElement | null;
    const tag = current?.tagName.toLowerCase();
    if (tag && blocks.some(x => x[0] === tag)) setBlock(tag);
    setBold(document.queryCommandState('bold'));
    setItalic(document.queryCommandState('italic'));
    setUnderline(document.queryCommandState('underline'));
    setSize(current?.style.fontSize || '1rem');
    const a = current ? window.getComputedStyle(current).textAlign : 'left';
    setAlign(a === 'center' ? 'center' : a === 'right' ? 'right' : 'left');
  };

  const emit = () => {
    const html = ref.current?.innerHTML || '';
    lastValue.current = html;
    onChange(html);
    requestAnimationFrame(sync);
  };

  const run = (name: string, value?: string) => {
    restoreRange();
    document.execCommand(name, false, value);
    saveRange();
    emit();
  };

  const changeSize = (value: string) => {
    restoreRange();
    document.execCommand('fontSize', false, '7');
    ref.current?.querySelectorAll('font[size="7"]').forEach(font => {
      const span = document.createElement('span');
      span.style.fontSize = value;
      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });
    setSize(value);
    saveRange();
    emit();
  };

  const link = () => {
    restoreRange();
    const url = window.prompt('Enter a full URL or an internal path such as /booking');
    if (!url) return;
    const safe = /^(https?:\/\/|mailto:|tel:|\/)/i.test(url.trim()) ? url.trim() : 'https://' + url.trim();
    document.execCommand('createLink', false, safe);
    saveRange();
    emit();
  };

  const cta = (label: string, href: string) => {
    restoreRange();
    document.execCommand('insertHTML', false, '<a href="' + href + '" class="content-cta">' + label + '</a>');
    saveRange();
    emit();
  };

  const button = 'inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-200';

  return (
    <div className="relative rounded-xl border bg-white shadow-sm">
      <div className="sticky top-0 z-50 -mx-px flex flex-wrap items-center gap-1 border-b border-white/60 bg-white/75 p-2 shadow-md backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <select aria-label="Text style" value={block} onChange={e => run('formatBlock', e.target.value)} className="h-9 rounded-lg border bg-white px-2 text-xs font-semibold">
          {blocks.map(x => <option key={x[0]} value={x[0]}>{x[1]}</option>)}
        </select>
        <select aria-label="Font size" value={size} onChange={e => changeSize(e.target.value)} className="h-9 rounded-lg border bg-white px-2 text-xs font-semibold">
          {sizes.map(x => <option key={x[0]} value={x[0]}>{x[1]}</option>)}
        </select>
        <button type="button" title="Bold" aria-pressed={bold} onMouseDown={e => e.preventDefault()} onClick={() => run('bold')} className={button + ' ' + (bold ? 'bg-slate-200' : '')}><b>B</b></button>
        <button type="button" title="Italic" aria-pressed={italic} onMouseDown={e => e.preventDefault()} onClick={() => run('italic')} className={button + ' ' + (italic ? 'bg-slate-200 italic' : 'italic')}>I</button>
        <button type="button" title="Underline" aria-pressed={underline} onMouseDown={e => e.preventDefault()} onClick={() => run('underline')} className={button + ' ' + (underline ? 'bg-slate-200 underline' : 'underline')}>U</button>
        <button type="button" title="Bullet list" onMouseDown={e => e.preventDefault()} onClick={() => run('insertUnorderedList')} className={button}><List className="h-4 w-4" /></button>
        <button type="button" title="Numbered list" onMouseDown={e => e.preventDefault()} onClick={() => run('insertOrderedList')} className={button}><ListOrdered className="h-4 w-4" /></button>
        <button type="button" title="Align left" aria-pressed={align === 'left'} onMouseDown={e => e.preventDefault()} onClick={() => run('justifyLeft')} className={button + ' ' + (align === 'left' ? 'bg-slate-200' : '')}><AlignLeft className="h-4 w-4" /></button>
        <button type="button" title="Align center" aria-pressed={align === 'center'} onMouseDown={e => e.preventDefault()} onClick={() => run('justifyCenter')} className={button + ' ' + (align === 'center' ? 'bg-slate-200' : '')}><AlignCenter className="h-4 w-4" /></button>
        <button type="button" title="Align right" aria-pressed={align === 'right'} onMouseDown={e => e.preventDefault()} onClick={() => run('justifyRight')} className={button + ' ' + (align === 'right' ? 'bg-slate-200' : '')}><AlignRight className="h-4 w-4" /></button>
        <button type="button" title="Add link" onMouseDown={e => e.preventDefault()} onClick={link} className={button}><Link2 className="h-4 w-4" /></button>
        <button type="button" title="Remove link" onMouseDown={e => e.preventDefault()} onClick={() => run('unlink')} className={button}><Unlink className="h-4 w-4" /></button>
        <button type="button" title="Plan My Safari" onMouseDown={e => e.preventDefault()} onClick={() => cta('Plan My Safari','/booking')} className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-2 text-[11px] font-bold text-cyan-800">Plan My Safari</button>
        <button type="button" title="Contact Us" onMouseDown={e => e.preventDefault()} onClick={() => cta('Contact Us','/contact')} className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-2 text-[11px] font-bold text-orange-800">Contact Us</button>
        <button type="button" title="Undo" onMouseDown={e => e.preventDefault()} onClick={() => run('undo')} className={button + ' ml-auto'}><Undo2 className="h-4 w-4" /></button>
        <button type="button" title="Redo" onMouseDown={e => e.preventDefault()} onClick={() => run('redo')} className={button}><Redo2 className="h-4 w-4" /></button>
        <button type="button" title="Clear formatting" onMouseDown={e => e.preventDefault()} onClick={() => run('removeFormat')} className={button}><Minus className="h-4 w-4" /></button>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning onInput={emit} onKeyUp={sync} onMouseUp={sync} onFocus={sync} onSelect={sync} className="min-h-[320px] p-5 text-[16px] leading-8 text-slate-800 focus:outline-none" />
      <div className="border-t bg-slate-50 px-4 py-2 text-[11px] text-slate-500">Highlight text or place the cursor in a paragraph. The toolbar shows its current H1/H2/H3/body, size, bold, italic and alignment state.</div>
    </div>
  );
}
