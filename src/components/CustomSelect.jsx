import React, { useState, useRef, useEffect } from "react";
import { ChevronIcon } from "./icons/ChevronIcon";
import "./CustomSelect.css";

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option) {
    onChange(option);
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setOpen(true);
        setHighlighted(options.findIndex((opt) => opt.value === value));
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      setHighlighted((h) =>
        h === null ? 0 : Math.min(h + 1, options.length - 1)
      );
    }
    if (e.key === "ArrowUp") {
      setHighlighted((h) => (h === null ? 0 : Math.max(h - 1, 0)));
    }
    if (e.key === "Enter" && highlighted !== null) {
      handleSelect(options[highlighted].value);
    }
  }

  return (
    <div
      className="custom-select-root"
      ref={ref}
      tabIndex={0}
      aria-label={ariaLabel || label}
      onKeyDown={handleKeyDown}
    >
      {label && <label className="custom-select-label">{label}</label>}
      <button
        className={`custom-select-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          {options.find((opt) => opt.value === value)?.label ||
            options[0].label}
        </span>
        <span className="custom-select-arrow" aria-hidden>
          <ChevronIcon />
        </span>
      </button>
      <ul
        className={`custom-select-list${open ? " open" : ""}`}
        role="listbox"
        aria-activedescendant={
          highlighted !== null
            ? `custom-select-option-${highlighted}`
            : undefined
        }
        style={{ maxHeight: open ? 260 : 0 }}
      >
        {options.map((opt, i) => (
          <li
            key={opt.value}
            id={`custom-select-option-${i}`}
            className={`custom-select-option${
              value === opt.value ? " selected" : ""
            }${highlighted === i ? " highlighted" : ""}`}
            role="option"
            aria-selected={value === opt.value}
            tabIndex={-1}
            onClick={() => handleSelect(opt.value)}
            onMouseEnter={() => setHighlighted(i)}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
