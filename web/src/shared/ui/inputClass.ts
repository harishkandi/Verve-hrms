/** Classes for text inputs, selects and textareas, so every form looks the same. */
export const inputClass =
  'h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-colors [color-scheme:light] placeholder:text-subtle hover:border-subtle/50 focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:opacity-60 aria-[invalid=true]:border-bad dark:[color-scheme:dark]'

/** Same look for a multi-line textarea (no fixed height). */
export const textareaClass =
  'min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-subtle hover:border-subtle/50 focus:border-primary focus:ring-3 focus:ring-primary/15 aria-[invalid=true]:border-bad'
