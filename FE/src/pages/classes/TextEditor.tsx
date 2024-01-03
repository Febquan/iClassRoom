import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextEditorTools } from "./TextEditorTools";

export default function TextEditor({
  content,
  onChange,
}: {
  content: string | undefined;
  onChange: (text: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: "border-solid border-2 p-[2rem] rounded-lg min-h-[15rem] ",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  // useEffect(() => {
  //   // editor?.commands.setContent(content as string);
  // }, [content, editor]);
  if (!editor) return <></>;
  return (
    <>
      <TextEditorTools editor={editor} />
      <EditorContent editor={editor} className="my-content-tiptap" />
    </>
  );
}
