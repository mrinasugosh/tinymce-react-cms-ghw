import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyEditor() {
  const editorRef = useRef(null);
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(_evt, editor) => editorRef.current = editor}
      init={{
        plugins: 'wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
      }}
      initialValue="Write your blog post here..."
    />
  );
}