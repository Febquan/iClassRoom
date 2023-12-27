import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextEditorTools } from "./TextEditorTools";
import { useEffect } from "react";

export default function TextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (text: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],

    editorProps: {
      attributes: {
        class: "border-solid border-2 p-[2rem] rounded-lg min-h-[15rem] ",
      },
    },
    onUpdate({ editor }) {
      if (!editor.isFocused) {
        onChange(editor.getHTML());
        console.log(editor.getHTML());
      }
    },
  });
  console.log(content);
  useEffect(() => {
    editor?.commands.setContent(content as string);
  }, [content, editor]);
  if (!editor) return <></>;
  return (
    <>
      <TextEditorTools editor={editor} />
      <EditorContent editor={editor} className="my-content-tiptap" />
    </>
  );
}
