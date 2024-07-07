"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

import { makePost } from "@/actions/common";

const BoardWrite = ({
  isAdmin = false,
  isSchool = false,
}: {
  isAdmin?: boolean;
  isSchool?: boolean;
}) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "text-2xl font-bold",
          },
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "mx-auto focus:outline focus:outline-primary px-6 py-2 w-full border rounded-md min-h-[300px] !min-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleSave = async () => {
    if (title.trim() && title.length > 100) {
      alert("제목은 100자 이하로 작성해주세요");
      return;
    }
    setLoading(true);
    try {
      const response = await makePost({
        content: content.trim(),
        title: title.trim(),
        isPrivate,
        isAdmin,
        isPinned,
        isSchool,
      });

      if (response && response.message) {
        alert(response.message);
        setContent("");
        setTitle("");
        setIsPrivate(false);
        setIsPinned(false);
        editor?.commands.clearContent();
      }

      if (response && response.error) {
        alert(response.error);
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생하였습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        placeholder="제목을 입력해주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      <Toolbar editor={editor} />
      <div className="flex flex-col justify-stretch min-h-[400px] w-full">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center gap-2 justify-start w-full">
        {!isAdmin && (
          <>
            <p>이름 비공개</p>
            <Checkbox
              checked={isPrivate}
              onCheckedChange={(checked: boolean) => {
                setIsPrivate(checked);
              }}
            />
          </>
        )}

        {isAdmin && (
          <>
            <p>글 고정하기</p>
            <Checkbox
              checked={isPinned}
              onCheckedChange={(checked: boolean) => {
                setIsPinned(checked);
              }}
            />
          </>
        )}
      </div>
      <Button
        className="w-full my-4"
        onClick={handleSave}
        type="button"
        disabled={loading || !content || !title}
      >
        작성하기
      </Button>
    </>
  );
};

export default BoardWrite;
