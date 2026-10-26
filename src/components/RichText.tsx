import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = { data?: SerializedEditorState | null | unknown; className?: string }

export function RichText({ data, className = '' }: Props) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as SerializedEditorState} className={`kk-prose ${className}`} />
}
