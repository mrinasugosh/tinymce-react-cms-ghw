import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyEditor() {
  const editorRef = useRef(null);
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(_evt, editor) => editorRef.current = editor}
      init={{
        plugins: 'a11ychecker tinymcespellchecker anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | a11ycheck spellcheckdialog | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        spellchecker_language: 'en',
      }}
      initialValue="Write your blog post here..."
    />
  );
}