import React from "react";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import { IFormData } from "../pages/ModifyBookForm";

interface Tag {
  id: string;
  text: string;
  className: string;
}

interface TagInputProps {
  label: string;
  tags: Tag[];
  placeholder: string;
  maxTags?: number;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  name: keyof IFormData;
}

function TagInput({
  label,
  tags,
  placeholder,
  maxTags = 7,
  setFormData,
  name,
}: TagInputProps): React.ReactElement {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <ReactTags
        tags={tags as { id: string; text: string; className: string }[]}
        separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
        handleDelete={(i) => {
          setFormData((prev) => ({
            ...prev,
            [name]: (prev[name] as Tag[]).filter((_, index) => index !== i),
          }));
        }}
        handleAddition={(tag) => {
          setFormData((prev) => ({
            ...prev,
            [name]: [
              ...((prev[name] as Tag[]) ?? []),
              {
                id: tag.id,
                text: tag.text,
                className: tag.className,
              },
            ],
          }));
        }}
        inputFieldPosition="bottom"
        placeholder={placeholder}
        allowDragDrop={false}
        clearAll
        onClearAll={() => {
          setFormData((prev) => ({
            ...prev,
            [name]: [],
          }));
        }}
        maxTags={maxTags}
        classNames={{
          tags: "flex flex-wrap w-full",
          tagInputField:
            "mt-1 p-2 block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          tag: "inline-flex items-center whitespace-nowrap bg-gray-300 text-gray-700 rounded-md px-2 py-1 mt-2 mr-2",
          remove: "inline-block ml-2",
          suggestions: "mt-2",
          activeSuggestion:
            "bg-indigo-500 text-white cursor-pointer p-1 rounded-md",
          clearAll: "text-red-500 cursor-pointer shrink-0",
          tagInput: "flex-1 flex gap-2",
          selected: "flex flex-wrap w-full",
          editTagInput: "flex gap-2 flex-nowrap mr-2",
          editTagInputField:
            "mt-1 p-2 block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
        }}
      />
    </div>
  );
}

export default TagInput;
