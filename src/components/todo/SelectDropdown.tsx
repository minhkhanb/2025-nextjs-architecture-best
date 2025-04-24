'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  fitContent?: boolean; // New prop for width control
}

export default function SelectDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
  allowClear = true,
  buttonClassName = '',
  buttonStyle = {},
  fitContent = false,
}: SelectDropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'left' | 'right'>('left');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const selectedOption =
    options.find((option) => option.value === value) || null;

  // Create a portal container for the dropdown menu
  useEffect(() => {
    // Only create the portal container if it doesn't exist yet
    if (!portalContainer) {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.pointerEvents = 'none'; // Let clicks pass through
      container.setAttribute('id', 'dropdown-portal-container');
      document.body.appendChild(container);
      setPortalContainer(container);
    }

    return () => {
      // Clean up portal container when component unmounts
      if (portalContainer && document.body.contains(portalContainer)) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [portalContainer]);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const dropdownWidth = Math.max(200, buttonRect.width);

    // If dropdown would go off screen on the right, position it to open to the left
    if (buttonRect.left + dropdownWidth > screenWidth - 20) {
      setMenuPosition('right');
    } else {
      setMenuPosition('left');
    }
  }, [isOpen]);

  // This allows clearing the selection when allowClear is true
  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || null);
  };

  // Enhanced options with an empty option for clearing
  const enhancedOptions = allowClear
    ? [{ value: '', label: placeholder }, ...options]
    : options;

  // Handle opening and closing of dropdown
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`${fitContent ? 'w-auto inline-block' : 'w-full'} ${className}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Listbox
        value={selectedOption}
        onChange={handleChange}
        as="div"
        className="relative"
      >
        {({ open }) => {
          // Update isOpen state to match Listbox open state
          if (open !== isOpen) {
            setTimeout(() => setIsOpen(open), 0);
          }

          return (
            <>
              <Listbox.Button
                ref={buttonRef}
                className={`relative ${fitContent ? 'w-auto' : 'w-full'} cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm ${buttonClassName}`}
                style={buttonStyle}
              >
                <span className="block truncate font-medium">
                  {selectedOption?.label || placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              {portalContainer &&
                createPortal(
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      className={`absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg border border-gray-200 focus:outline-none sm:text-sm ${
                        menuPosition === 'right' ? 'right-0' : 'left-0'
                      }`}
                      style={{
                        width: buttonRef.current?.offsetWidth,
                        top: buttonRef.current
                          ? buttonRef.current.getBoundingClientRect().bottom +
                            window.scrollY
                          : 0,
                        left:
                          menuPosition === 'right'
                            ? 'auto'
                            : buttonRef.current
                              ? buttonRef.current.getBoundingClientRect().left +
                                window.scrollX
                              : 0,
                        right:
                          menuPosition === 'right'
                            ? buttonRef.current
                              ? window.innerWidth -
                                (buttonRef.current.getBoundingClientRect()
                                  .right +
                                  window.scrollX)
                              : 0
                            : 'auto',
                        position: 'absolute',
                        pointerEvents: 'auto', // Make element interactive
                      }}
                    >
                      {enhancedOptions.map((option, index) => (
                        <Listbox.Option
                          key={`${option.value}-${index}`}
                          className={({ active, selected }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-blue-50' : ''
                            } ${
                              selected
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-900'
                            }`
                          }
                          value={option.value === '' ? null : option}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {option.label}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-blue-600' : 'text-blue-600'
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>,
                  portalContainer
                )}
            </>
          );
        }}
      </Listbox>
    </div>
  );
}
