import React from "react";
import FormInput from "./FormInput";

const AddressFields = ({ section, addrStep, setAddrStep, form, errors, upd }) => {
  const groups = [
    {
      header: "Current Address",
      fields: section.fields.filter((f) => f.name.startsWith("current_")),
    },
    {
      header: "Permanent Address",
      fields: section.fields.filter((f) => f.name.startsWith("permanent_")),
    },
    {
      header: "Aadhaar Address",
      fields: section.fields.filter((f) => f.name === "aadhaar_address" || f.name === "nation"),
    },
  ];

  const currentGroup = groups[addrStep - 1];

  return (
    <div className="col-span-2">
      <div className="flex gap-2 mb-4">
        {groups.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors ${
              idx + 1 === addrStep ? "bg-sky-500" : idx + 1 < addrStep ? "bg-sky-200 dark:bg-sky-900/50" : "bg-gray-100 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
        {currentGroup.header}
      </p>
      <div className="grid grid-cols-2 gap-3 items-start">
        {currentGroup.fields.map((field) => (
          <FormInput
            key={field.name}
            field={field}
            value={form[field.name]}
            error={errors[field.name]}
            onChange={(val) => upd(field.name, val)}
          />
        ))}
      </div>
    </div>
  );
};

export default AddressFields;