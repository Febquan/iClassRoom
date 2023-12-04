import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextEditorTools } from "./TextEditorTools";

export default function TextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (text: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: "border-solid border-2 p-[2rem] rounded-lg min-h-[15rem] ",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });
  if (!editor) return <></>;
  return (
    <>
      <TextEditorTools editor={editor} />
      <EditorContent editor={editor} className="my-content-tiptap" />
    </>
  );
}
