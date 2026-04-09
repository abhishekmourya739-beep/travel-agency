"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { Fragment } from "react";

export default function FilterSelect({
  value,
  onChange,
  options = [],
  placeholder,
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton className="flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-0 focus-visible:outline-none">
          <span className="truncate">{value?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </ListboxButton>

        <Transition
          as={Fragment}
          enter="transition duration-150 ease-out"
          enterFrom="opacity-0 translate-y-2 scale-[0.98]"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-1 scale-[0.98]"
        >
          <ListboxOptions
            modal={false}
            className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] focus:outline-none"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value || option.label}
                value={option}
                className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm text-slate-700 transition data-focus:bg-slate-100"
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium">{option.label}</span>
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-cyan-600" />
                    ) : null}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
