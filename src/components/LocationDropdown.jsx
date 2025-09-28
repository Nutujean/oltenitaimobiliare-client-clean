import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

const locations = [
  { id: "", name: "Toate locațiile" },
  { id: "Oltenița", name: "Oltenița" },
  { id: "Budești", name: "Budești" },
  { id: "Ulmeni", name: "Ulmeni" },
  { id: "Spantov", name: "Spantov" },
  { id: "Radovanu", name: "Radovanu" },
  { id: "Cascioarele", name: "Cascioarele" },
  { id: "Mitreni", name: "Mitreni" },
  { id: "Valea Rosie", name: "Valea Rosie" },
  { id: "Curcani", name: "Curcani" },
  { id: "Soldanu", name: "Soldanu" },
  { id: "Negoiesti", name: "Negoiesti" },
  { id: "Clatesti", name: "Clatesti" },
  { id: "Chiselet", name: "Chiselet" },
  { id: "Chirnogi", name: "Chirnogi" },
  { id: "Manastirea", name: "Manastirea" },
  { id: "Alte", name: "Alte localități" },
];

export default function LocationDropdown({ location, setLocation }) {
  return (
    <Listbox value={location} onChange={setLocation}>
      <div className="relative">
        <Listbox.Button className="border p-3 rounded w-full text-left bg-white flex justify-between items-center">
          {locations.find((l) => l.id === location)?.name}
          <FaChevronDown className="ml-2 text-gray-500" />
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto z-50">
          {locations.map((l) => (
            <Listbox.Option
              key={l.id}
              value={l.id}
              className="cursor-pointer select-none p-2 hover:bg-gray-100"
            >
              {l.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
