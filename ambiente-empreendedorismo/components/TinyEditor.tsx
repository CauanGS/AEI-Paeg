"use client";

import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";

interface TinyEditorProps {
  value?: string; // Substitui initialValue por value
  onEditorChange: (content: string) => void;
}

export default function TinyEditor({ value, onEditorChange }: TinyEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p>Carregando editor...</p>;
  }

  return (
    <Editor
      tinymceScriptSrc="/vendor/tinymce/tinymce.min.js"
      value={value || ""} // Agora é controlado via prop value
      onEditorChange={(content) => onEditorChange(content)}
      init={{
        height: 400,
        menubar: true,
        skin: "oxide",
        content_css: "default",

        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],

        toolbar:
          "undo redo | blocks | bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",

        content_style:
          "body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; }",
      }}
    />
  );
}