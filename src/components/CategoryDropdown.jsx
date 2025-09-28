import { Listbox } from "@headlessui/react";

const categories = [
  { id: "", name: "Toate categoriile" },
  { id: "apartament", name: "Apartamente" },
  { id: "casa", name: "Case" },
  { id: "garaj", name: "Garaj" },
  { id: "spatiu comercial", name: "Spatiu comercial" },
  { id: "teren", name: "Terenuri" },
  { id: "garsoniera", name: "Garsoniere" },
];

export default function CategoryDropdown({ category, setCategory }) {
  return (
    <Listbox value={category} onChange={setCategory}>
      <div className="relative">
        <Listbox.Button className="border p-3 rounded w-full text-left bg-white">
          {categories.find((c) => c.id === category)?.name}
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto z-50">
          {categories.map((c) => (
            <Listbox.Option
              key={c.id}
              value={c.id}
              className="cursor-pointer select-none p-2 hover:bg-gray-100"
            >
              {c.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
