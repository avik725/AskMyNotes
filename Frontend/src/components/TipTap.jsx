import {
  TextStyleKit,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Minus,
  Plus,
  Redo2,
  SquareDashedBottomCode,
  Strikethrough,
  TextQuote,
  TextWrap,
  Undo2,
} from "lucide-react";
import "@/assets/css/tiptap.css";
import Select from "react-select";
import { Placeholder } from "@tiptap/extensions";

const extensions = [TextStyleKit, StarterKit];

const options = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
  { value: "para", label: "Paragraph" },
];

function MenuBar({ editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  // const [fontSize, setFontSize] = useState(16);

  const getActiveOption = () => {
    if (editorState.isHeading1) return options.find((op) => op.value === "h1");
    if (editorState.isHeading2) return options.find((op) => op.value === "h2");
    if (editorState.isHeading3) return options.find((op) => op.value === "h3");
    if (editorState.isHeading4) return options.find((op) => op.value === "h4");
    if (editorState.isHeading5) return options.find((op) => op.value === "h5");
    if (editorState.isHeading6) return options.find((op) => op.value === "h6");
    if (editorState.isParagraph)
      return options.find((op) => op.value === "para");
    return null;
  };

  const textFormattingSelectionFn = (e) => {
    if (e.value === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (e.value === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (e.value === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    } else if (e.value === "h4") {
      editor.chain().focus().toggleHeading({ level: 4 }).run();
    } else if (e.value === "h5") {
      editor.chain().focus().toggleHeading({ level: 5 }).run();
    } else if (e.value === "h6") {
      editor.chain().focus().toggleHeading({ level: 6 }).run();
    } else if (e.value === "para") {
      editor.chain().focus().setParagraph().run();
    }
  };

  // const increaseFontSize = () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .setFontSize(`${fontSize + 2}px`)
  //     .run();
  //   setFontSize((prev) => prev + 2);
  // };

  // const decreaseFontSize = () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .setFontSize(`${fontSize - 2}px`)
  //     .run();
  //   setFontSize((prev) => prev - 2);
  // };

  return (
    <div className="control-group">
      {/* <div className="button-group">
        
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
      </div> */}
      <div className="menu mb-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
        >
          <Strikethrough size={16} />
        </button>
        {/* <div>
          <button
            onClick={decreaseFontSize}
            style={{
              padding: 8,
              height: '100%',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Minus size={18} />
          </button>
          <button disabled style={{ height: '100%', borderRadius: 0 }}>
            {fontSize}
          </button>
          <button
            onClick={increaseFontSize}
            style={{
              padding: 8,
              height: '100%',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <Plus size={18} />
          </button>
        </div> */}
        <Select
          name={"textFormatting"}
          id={"textFormatting"}
          styles={{
            control: (styles) => ({
              ...styles,
              backgroundColor: "#3d251414",
              border: "1px solid #d1d6e3",
              borderRadius: "8px",
              width: 100,
            }),
          }}
          value={getActiveOption()}
          onChange={(e) => textFormattingSelectionFn(e)}
          options={options}
        />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? "is-active" : ""}
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
        >
          <SquareDashedBottomCode size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
        >
          <TextQuote size={18} />
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <TextWrap />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <Redo2 size={18} />
        </button>
      </div>
    </div>
  );
}
function Tiptap({ label, getData = () => {} }) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Placeholder.configure({
        placeholder: "Enter something …",
      }),
    ], // define your extension array
    content: "", // initial content
  });

  useEffect(()=>{
    getData(editor.getText())
  },[editor.getText()])

  return (
    <div className="tiptap-container">
      <label htmlFor="editor" className="form-label">
        {label}
      </label>
      <div className="form-control">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Tiptap;
