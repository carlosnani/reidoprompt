"use client";

import { useMemo, useState } from "react";
import Select, { MultiValue, OnChangeValue, StylesConfig } from "react-select";
import { Category } from "@/lib/supabase/queries";

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryMultiSelectProps {
  categories: Category[];
  name?: string;
}

const customStyles: StylesConfig<CategoryOption, true> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "var(--admin-primary)" : "var(--admin-border-strong)",
    boxShadow: state.isFocused ? "0 0 0 1px var(--admin-primary)" : provided.boxShadow,
    backgroundColor: "var(--admin-bg-surface)",
    minHeight: 44,
    padding: "2px",
    color: "var(--admin-text-primary)",
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: "var(--admin-bg-surface)",
    padding: "4px 8px",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--admin-text-primary)",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--admin-text-muted)",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    backgroundColor: "var(--admin-bg-surface)",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--admin-primary-soft)"
      : state.isFocused
      ? "var(--admin-bg-muted)"
      : "var(--admin-bg-surface)",
    color: state.isSelected ? "var(--admin-primary)" : "var(--admin-text-primary)",
    cursor: "pointer",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--admin-primary-soft)",
    border: "1px solid var(--admin-border-strong)",
    borderRadius: "9999px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--admin-primary)",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "var(--admin-primary)",
    ':hover': {
      backgroundColor: "var(--admin-primary-hover)",
      color: "var(--admin-text-inverse)",
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "var(--admin-primary)" : "var(--admin-text-secondary)",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "var(--admin-border-default)",
  }),
};

export function CategoryMultiSelect({ categories, name = "categories" }: CategoryMultiSelectProps) {
  const options = useMemo(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories]
  );

  const [selectedOptions, setSelectedOptions] = useState<MultiValue<CategoryOption>>([]);

  const handleChange = (value: OnChangeValue<CategoryOption, true>) => {
    setSelectedOptions(value);
  };

  return (
    <div className="space-y-2">
      <Select
        inputId="categories"
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={categories.length > 0 ? "Selecione as categorias..." : "Nenhuma categoria disponível"}
        styles={customStyles}
        isDisabled={categories.length === 0}
        classNamePrefix="react-select"
        noOptionsMessage={() => "Nenhuma categoria encontrada"}
      />

      {selectedOptions.map((option) => (
        <input key={option.value} type="hidden" name={name} value={option.value} />
      ))}
    </div>
  );
}
