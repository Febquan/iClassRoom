import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  QuoteIcon,
  HeadingIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import {
  ListOrderedIcon,
  ArrowLeftToLineIcon,
  ArrowRightFromLineIcon,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Editor } from "@tiptap/react";

export function TextEditorTools({ editor }: { editor: Editor }) {
  if (!editor) return null;
  return (
    <div>
      <ToggleGroup type="multiple" size="sm" className="w-fit">
        <ToggleGroupItem
          value="heading"
          aria-label="Toggle heading"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          }
          data-state={editor.isActive("heading") ? "on" : "off"}
        >
          <HeadingIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          data-state={editor.isActive("bold") ? "on" : "off"}
        >
          <FontBoldIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          data-state={editor.isActive("italic") ? "on" : "off"}
        >
          <FontItalicIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          data-state={editor.isActive("strikethrough") ? "on" : "off"}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="blockquote"
          aria-label="Toggle blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          data-state={editor.isActive("blockquote") ? "on" : "off"}
        >
          <QuoteIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bulletList"
          aria-label="Toggle bulletList"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          data-state={editor.isActive("bulletList") ? "on" : "off"}
        >
          <ListBulletIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="orderedList"
          aria-label="Toggle orderedList"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          data-state={editor.isActive("orderedList") ? "on" : "off"}
        >
          <ListOrderedIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="liftListItem"
          data-state="off"
          aria-label="Toggle liftListItem"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          disabled={!editor.can().liftListItem("listItem")}
        >
          <ArrowLeftToLineIcon className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="sinkListItemListItem"
          data-state="off"
          aria-label="Toggle sinkListItemListItem"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
        >
          <ArrowRightFromLineIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
