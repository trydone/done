import {
  AlignmentCenterIcon,
  AlignmentLeftIcon,
  AlignmentRightIcon,
  BoldIcon,
  BulletListIcon,
  ChainLink2Icon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  MoonIcon,
  NumberedListIcon,
  QuoteIcon,
  SunIcon,
  Text1Icon,
  UnderlineIcon,
} from '@fingertip/icons'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import {
  BubbleMenu,
  Editor,
  EditorContent,
  HTMLContent,
  JSONContent,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'

import { Button } from '@/components/ui/button'
import { FormControl } from '@/components/ui/form-control'
import { cn } from '@/lib/utils'

import { FORMAT_HTML } from '../ai/ai.utils'
import { AskAI } from '../ai/ask-ai'
import { AskAiButton } from '../ai/ask-ai-button'
import { ListMenuContent } from '../ui/list'

const MenuBar = ({
  editor,
  showTextColor,
  showFontSizes,
  showListStyles,
  showTextAlign,
  showLink,
  children,
}: {
  editor: Editor
  showTextColor?: boolean
  showFontSizes?: boolean
  showListStyles?: boolean
  showTextAlign?: boolean
  showLink?: boolean
  children?: ReactNode
}) => {
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center">
      {children}
      <Button
        size="xs"
        variant={editor.isActive('bold') ? 'default' : 'muted'}
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold"
        className="mr-1 mt-1"
      >
        <BoldIcon width={12} height={12} />
      </Button>
      <Button
        size="xs"
        variant={editor.isActive('italic') ? 'default' : 'muted'}
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic"
        className="mr-1 mt-1"
      >
        <ItalicIcon width={12} height={12} />
      </Button>
      <Button
        size="xs"
        variant={editor.isActive('underline') ? 'default' : 'muted'}
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        title="Underline"
        className="mr-1 mt-1"
      >
        <UnderlineIcon width={12} height={12} />
      </Button>

      {showFontSizes && (
        <>
          <Button
            size="xs"
            variant={editor.isActive('paragraph') ? 'default' : 'muted'}
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            title="Paragraph"
            className="mr-1 mt-1"
          >
            <Text1Icon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={
              editor.isActive('heading', { level: 1 }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="H1"
            className="mr-1 mt-1"
          >
            <H1Icon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={
              editor.isActive('heading', { level: 2 }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="H2"
            className="mr-1 mt-1"
          >
            <H2Icon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={
              editor.isActive('heading', { level: 3 }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="H3"
            className="mr-1 mt-1"
          >
            <H3Icon width={12} height={12} />
          </Button>
        </>
      )}

      {showListStyles && (
        <>
          <Button
            size="xs"
            variant={editor.isActive('bulletList') ? 'default' : 'muted'}
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
            className="mr-1 mt-1"
          >
            <BulletListIcon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={editor.isActive('orderedList') ? 'default' : 'muted'}
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered list"
            className="mr-1 mt-1"
          >
            <NumberedListIcon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={editor.isActive('blockquote') ? 'default' : 'muted'}
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
            className="mr-1 mt-1"
          >
            <QuoteIcon width={12} height={12} />
          </Button>
        </>
      )}

      {showTextAlign && (
        <>
          <Button
            size="xs"
            variant={
              editor.isActive({ textAlign: 'left' }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align left"
            className="mr-1 mt-1"
          >
            <AlignmentLeftIcon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={
              editor.isActive({ textAlign: 'center' }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align center"
            className="mr-1 mt-1"
          >
            <AlignmentCenterIcon width={12} height={12} />
          </Button>
          <Button
            size="xs"
            variant={
              editor.isActive({ textAlign: 'right' }) ? 'default' : 'muted'
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align right"
            className="mr-1 mt-1"
          >
            <AlignmentRightIcon width={12} height={12} />
          </Button>
        </>
      )}

      {showLink && (
        <>
          <Button
            size="xs"
            variant={editor.isActive('link') ? 'default' : 'muted'}
            type="button"
            onClick={setLink}
            title="Set link"
            className="mr-1 mt-1"
          >
            <ChainLink2Icon width={12} height={12} />
          </Button>
        </>
      )}

      {showTextColor && (
        <>
          <Button
            size="xs"
            variant={
              editor.isActive('textStyle', { color: '#000000' })
                ? 'default'
                : 'muted'
            }
            type="button"
            onClick={() =>
              editor.chain().focus().selectAll().setColor('#000000').run()
            }
            title="Black text"
            className="mr-1 mt-1"
          >
            <MoonIcon width={12} height={12} />
          </Button>

          <Button
            size="xs"
            variant={
              editor.isActive('textStyle', { color: '#ffffff' })
                ? 'default'
                : 'muted'
            }
            type="button"
            onClick={() =>
              editor.chain().focus().selectAll().setColor('#ffffff').run()
            }
            title="White text"
            className="mr-1 mt-1"
          >
            <SunIcon width={12} height={12} />
          </Button>

          <input
            type="color"
            onInput={(event: any) =>
              editor
                .chain()
                .focus()
                .selectAll()
                .setColor(event.target?.value)
                .run()
            }
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
            title="Text colour"
            className="mr-1 mt-1 size-[30px]"
          />
        </>
      )}
    </div>
  )
}

type Props = {
  id: string
  name: string
  label?: ReactNode
  onChange: (json: JSONContent, html: HTMLContent) => void
  defaultValue?: string
  register: any
  isDisabled?: boolean
  placeholder?: string
  showTextColor?: boolean
  showFontSizes?: boolean
  showListStyles?: boolean
  showTextAlign?: boolean
  showLink?: boolean
  backgroundColor?: string
  overlayColor?: string
  ai?: boolean
  suggestions?: string[][]
  isBubbleMenu?: boolean
  minHeight?: number
  className?: string
}

export const RteField = forwardRef(
  (
    {
      id,
      name,
      label,
      defaultValue,
      register,
      onChange,
      isDisabled,
      placeholder,
      showTextColor = true,
      showFontSizes = true,
      showListStyles = true,
      showTextAlign = true,
      showLink = true,
      backgroundColor,
      overlayColor,
      ai,
      suggestions,
      isBubbleMenu,
      minHeight = 100,
      className,
    }: Props,
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [content, setContent] = useState(defaultValue)

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Underline.configure({
          HTMLAttributes: {
            class: 'underline',
          },
        }),
        TextAlign.configure({
          defaultAlignment: 'left',
          alignments: ['left', 'center', 'right'],
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: placeholder || 'Write your content here...',
        }),
        TextStyle,
        Color,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          linkOnPaste: true,
          HTMLAttributes: {
            // Change rel to different value
            // Allow search engines to follow links(remove nofollow)
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        }),
      ],
      content: defaultValue || '',
      onUpdate({ editor }) {
        const json = editor.getJSON()
        const html = editor.getHTML()

        if (editor.isEmpty) {
          onChange(
            {
              type: 'doc',
              content: [],
            },
            '',
          )
          setContent('')
        } else {
          onChange(json, html)
          setContent(html)
        }
      },
      editorProps: {
        transformPastedHTML(html) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          return doc.body.textContent || ''
        },
        attributes: {
          style: `min-height: ${minHeight}px;`,
          class: cn(
            'prose p-3 focus:outline-none rounded-2xl border-[1.5px] border-input bg-card ring-offset-background focus:border-ring',
            {
              '[text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] !bg-transparent':
                showTextColor,
              'prose:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-a:underline prose-a:text-foreground prose-strong:text-foreground prose-em:text-foreground':
                !showTextColor,
            },
          ),
        },
      },
    })

    useImperativeHandle(ref, () => ({
      setContent(content: string) {
        editor?.commands.setContent(content)
      },
    }))

    const setEditorContent = useCallback(
      (content: string) => {
        if (!editor) {
          return
        }

        editor.commands.setContent(content)
        const html = editor.getHTML()
        const json = editor.getJSON()
        onChange(json, html)
        setContent(html)
      },
      [editor, onChange],
    )

    const onComplete = useCallback(() => {
      if (!editor) {
        return
      }

      const html = editor.getHTML()
      const json = editor.getJSON()
      onChange(json, html)
    }, [editor, onChange])

    return (
      <div>
        <FormControl name={name} label={label} className={className}>
          {editor && isBubbleMenu && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="rounded-md border-0.5 border-border bg-popover p-1 shadow-md">
                <MenuBar
                  editor={editor}
                  showTextColor={showTextColor}
                  showFontSizes={showFontSizes}
                  showListStyles={showListStyles}
                  showTextAlign={showTextAlign}
                  showLink={showLink}
                >
                  {ai && (
                    <AskAiButton
                      open={open}
                      setOpen={setOpen}
                      className="mr-1 mt-1"
                    />
                  )}
                </MenuBar>
              </div>
            </BubbleMenu>
          )}

          {editor && !isBubbleMenu && (
            <div className="mb-4">
              <MenuBar
                editor={editor}
                showTextColor={showTextColor}
                showFontSizes={showFontSizes}
                showListStyles={showListStyles}
                showTextAlign={showTextAlign}
                showLink={showLink}
              >
                {ai && (
                  <AskAiButton
                    open={open}
                    setOpen={setOpen}
                    className="mr-1 mt-1"
                  />
                )}
              </MenuBar>
            </div>
          )}

          {ai && open && (
            <ListMenuContent className="mb-3 mt-1 rounded-2xl">
              <AskAI
                content={content}
                setContent={setEditorContent}
                setIsCompleting={setIsCompleting}
                onComplete={onComplete}
                format={FORMAT_HTML}
                suggestions={suggestions}
                setOpen={setOpen}
              />
            </ListMenuContent>
          )}

          <div className="relative">
            {showTextColor && (
              <>
                <div
                  className="bg-page-widget-background absolute left-0 top-0 size-full rounded-2xl"
                  style={{ backgroundColor }}
                />

                {overlayColor && (
                  <div
                    className="absolute left-0 top-0 size-full rounded-2xl"
                    style={{ backgroundColor: overlayColor }}
                  />
                )}
              </>
            )}

            <EditorContent
              id={id}
              editor={editor}
              disabled={isDisabled || isCompleting}
            />
          </div>
        </FormControl>

        <input {...register(name, { required: true })} className="hidden" />
      </div>
    )
  },
)
