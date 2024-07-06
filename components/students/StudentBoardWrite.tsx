"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "../common/Toolbar";
import { useState } from "react";
import { Button } from "../ui/button";

const StudentBoardWrite = () => {
  const [content, setContent] = useState("");
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline focus:outline-primary px-4 py-2 w-full border rounded-md min-h-[300px] !min-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <>
      <Toolbar editor={editor} />
      <div className="flex flex-col justify-stretch min-h-[400px] w-full">
        <EditorContent editor={editor} />
      </div>
      <Button>작성하기</Button>
    </>
  );
};

export default StudentBoardWrite;
