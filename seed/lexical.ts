type TextNode = { type: 'text'; text: string; format: number; detail: 0; mode: 'normal'; style: ''; version: 1 }
type LinkNode = { type: 'link'; version: 3; direction: 'ltr'; format: ''; indent: 0; fields: { linkType: 'custom'; url: string; newTab: boolean }; children: TextNode[] }
type Inline = TextNode | LinkNode

const text = (t: string, bold = false): TextNode => ({ type: 'text', text: t, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 })
const link = (t: string, url: string): LinkNode => ({ type: 'link', version: 3, direction: 'ltr', format: '', indent: 0, fields: { linkType: 'custom', url, newTab: url.startsWith('http') }, children: [text(t)] })

const inline = (s: string): Inline[] => {
  const out: Inline[] = []
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(text(s.slice(last, m.index)))
    if (m[1]) out.push(text(m[1], true))
    else out.push(link(m[2], m[3]))
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(text(s.slice(last)))
  return out
}

const paragraph = (s: string) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: inline(s) })
const quote = (s: string) => ({ type: 'quote', format: '', indent: 0, version: 1, direction: 'ltr', children: inline(s) })
const heading = (s: string, tag: 'h2' | 'h3') => ({ type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr', children: inline(s) })
const list = (items: string[]) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1, format: '', indent: 0, version: 1, direction: 'ltr',
  children: items.map((it, i) => ({ type: 'listitem', value: i + 1, format: '', indent: 0, version: 1, direction: 'ltr', children: inline(it) })),
})

export const rich = (...lines: string[]) => {
  const children: unknown[] = []
  let bullets: string[] = []
  const flush = () => { if (bullets.length) { children.push(list(bullets)); bullets = [] } }
  for (const l of lines) {
    if (l.startsWith('- ')) { bullets.push(l.slice(2)); continue }
    flush()
    if (l.startsWith('> ')) children.push(quote(l.slice(2)))
    else if (l.startsWith('## ')) children.push(heading(l.slice(3), 'h2'))
    else if (l.startsWith('### ')) children.push(heading(l.slice(4), 'h3'))
    else children.push(paragraph(l))
  }
  flush()
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}
