import React, { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import LANGUAGES_CODE from "../constants/langaugesCode";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  const [langQuery, setLangQuery] = useState("");

  const filteredLanguages = LANGUAGES_CODE.filter((lang) =>
    lang.name.toLowerCase().includes(langQuery.toLowerCase())
  );

  return (
    <div>
      <label
        htmlFor="language"
        className="block text-sm font-medium text-gray-700"
      >
        Language
      </label>
      <Combobox value={value} onChange={onChange}>
        <ComboboxInput
          displayValue={(language: string) =>
            LANGUAGES_CODE.find((lang) => lang.code === language)?.name ?? ""
          }
          onChange={(event) => setLangQuery(event.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <ComboboxOptions className="w-full rounded-md border bg-white border-gray-300 p-1 transition duration-100 ease-in">
          {filteredLanguages.map((language) => (
            <ComboboxOption
              key={language.code}
              value={language.code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {language.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

export default LanguageSelector;
