"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Fragment } from "react";

export default function SearchSelect({
  label,
  placeholder,
  options = [],
  value = null,
  onChange,
  displayKey = "name",
  subTextKey = "",
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="flex min-h-22 w-full items-center justify-between px-6 py-5 text-left transition duration-200 hover:bg-slate-50 focus:outline-none focus:ring-0 focus-visible:outline-none">
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                {label}
              </p>

              {value ? (
                <div className="flex items-center gap-3 min-w-0">
                  <p className="truncate text-[15px] font-semibold text-slate-900 md:text-base">
                    {value[displayKey]}
                  </p>

                  {subTextKey && value[subTextKey] ? (
                    <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold bg-linear-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-100">
                      {value[subTextKey]}
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="text-[15px] text-slate-500 md:text-base">
                  {placeholder}
                </p>
              )}
            </div>

            <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition duration-200">
              <ChevronDown className="h-4 w-4" />
            </div>
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 translate-y-2 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-[0.98]"
          >
            <ListboxOptions
              modal={false}
              className="custom-scrollbar absolute left-0 top-[calc(100%+12px)] z-100 max-h-72 w-full overflow-y-auto rounded-[22px] border border-slate-200/70 bg-white/95 p-2 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl focus:outline-none"
            >
              {options.length === 0 ? (
                <div className="rounded-2xl px-4 py-4 text-sm text-slate-500">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <ListboxOption
                    key={option._id || option.slug || option[displayKey]}
                    value={option}
                    className="group cursor-pointer list-none rounded-2xl px-4 py-3 transition duration-150 data-focus:bg-slate-100"
                  >
                    {({ selected, focus }) => (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center justify-between gap-3 w-full min-w-0">
                          <p
                            className={`truncate text-[15px] font-semibold ${
                              selected || focus
                                ? "text-slate-900"
                                : "text-slate-800"
                            }`}
                          >
                            {option[displayKey]}
                          </p>

                          {subTextKey && option[subTextKey] ? (
                            <span className="shrink-0 rounded-full  px-3 py-1 text-xs font-semibold bg-linear-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-100">
                              {option[subTextKey]}
                            </span>
                          ) : null}
                        </div>

                        {selected ? (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </ListboxOption>
                ))
              )}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
