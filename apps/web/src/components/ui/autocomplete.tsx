"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface AutocompleteOption {
    label: string;
    value: any;
}

export type AutocompleteChangeReason = 'selectOption' | 'removeOption' | 'clear' | 'createOption' | 'blur-sm';

export interface AutocompleteProps<
    Value = AutocompleteOption,
    Multiple extends boolean = false,
    DisableClearable extends boolean = false,
    FreeSolo extends boolean = false
> {
    options: Value[];
    value?: Multiple extends true
    ? Value[]
    : (Value | null);
    defaultValue?: Multiple extends true
    ? Value[]
    : (Value | null);
    onChange?: (
        event: React.SyntheticEvent,
        value: Multiple extends true
            ? (FreeSolo extends true ? (Value | string)[] : Value[])
            : (FreeSolo extends true ? (Value | string | null) : (Value | null)),
        reason: AutocompleteChangeReason
    ) => void;
    onInputChange?: (event: React.SyntheticEvent, value: string, reason: string) => void;
    placeholder?: string;
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    label?: string;
    error?: boolean;
    helperText?: string;
    multiple?: Multiple;
    freeSolo?: FreeSolo;
    disableClearable?: DisableClearable;
    disableCloseOnSelect?: boolean;
    loading?: boolean;
    loadingText?: string;
    noOptionsText?: string;
    limitTags?: number;
    className?: string;
    getOptionLabel?: (option: Value | string) => string;
    isOptionEqualToValue?: (option: Value, value: Value) => boolean;
    filterOptions?: (options: Value[], state: { inputValue: string }) => Value[];
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: Value, state: { selected: boolean }) => React.ReactNode;
    renderTags?: (value: Value[], getTagProps: (index: number) => any) => React.ReactNode;
    chipClassName?: string;
}

function Autocomplete<
    Value = AutocompleteOption,
    Multiple extends boolean = false,
    DisableClearable extends boolean = false,
    FreeSolo extends boolean = false
>({
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    onInputChange,
    placeholder = 'Select an option',
    variant = 'outlined',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    readOnly = false,
    label,
    error = false,
    helperText,
    multiple = false as Multiple,
    freeSolo = false as FreeSolo,
    disableClearable = false as DisableClearable,
    disableCloseOnSelect = false,
    loading = false,
    loadingText = 'Loading...',
    noOptionsText = 'No options',
    limitTags = -1,
    className = '',
    getOptionLabel = (option: any) => {
        if (typeof option === 'string') return option;
        return option?.label || String(option);
    },
    isOptionEqualToValue = (option: any, value: any) => {
        if (typeof option === 'string' && typeof value === 'string') return option === value;
        return option?.value === value?.value;
    },
    filterOptions,
    renderOption,
    renderTags,
    chipClassName = '',
}: AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>) {
    const [internalValue, setInternalValue] = useState<any>(
        controlledValue !== undefined ? controlledValue : (defaultValue || (multiple ? [] : null))
    );
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [openUpward, setOpenUpward] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const variantClasses = {
        outlined: `border ${error ? 'border-error' : 'border-divider'} rounded-lg bg-background focus-within:ring-2 ${error ? 'focus-within:ring-error/20' : 'focus-within:ring-primary/20'}`,
        filled: `border-b-2 ${error ? 'border-error' : 'border-divider'} bg-grey rounded-t-lg focus-within:bg-grey/80 ${error ? 'focus-within:border-error' : 'focus-within:border-primary'}`,
        standard: `border-b ${error ? 'border-error' : 'border-divider'} focus-within:border-b-2 ${error ? 'focus-within:border-error' : 'focus-within:border-primary'}`,
    };

    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-4 py-3 text-lg',
    };

    const defaultFilterOptions = (opts: Value[], state: { inputValue: string }) => {
        return opts.filter(option => {
            const label = getOptionLabel(option).toLowerCase();
            return label.includes(state.inputValue.toLowerCase());
        });
    };

    const filteredOptions = filterOptions
        ? filterOptions(options, { inputValue })
        : defaultFilterOptions(options, { inputValue });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (!multiple && !freeSolo) {
                    setInputValue('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [multiple, freeSolo]);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const dropdownHeight = 240;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);
        onInputChange?.(e, newValue, 'input');
    };

    const handleOptionClick = (event: React.MouseEvent, option: Value) => {
        if (readOnly) return;

        if (multiple) {
            const valueArray = (value as Value[]) || [];
            const optionIndex = valueArray.findIndex(v => isOptionEqualToValue(option, v));

            let newValue: Value[];
            if (optionIndex > -1) {
                newValue = valueArray.filter((_, index) => index !== optionIndex);
            } else {
                newValue = [...valueArray, option];
            }

            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            onChange?.(event, newValue as any, optionIndex > -1 ? 'removeOption' : 'selectOption');

            if (!disableCloseOnSelect) {
                setIsOpen(false);
            }
            setInputValue('');
        } else {
            if (controlledValue === undefined) {
                setInternalValue(option);
            }
            onChange?.(event, option as any, 'selectOption');
            setIsOpen(false);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && freeSolo && inputValue.trim()) {
            e.preventDefault();

            if (multiple) {
                const newValue = [...((value as Value[]) || []), inputValue as any];
                if (controlledValue === undefined) {
                    setInternalValue(newValue);
                }
                onChange?.(e as any, newValue as any, 'createOption');
            } else {
                if (controlledValue === undefined) {
                    setInternalValue(inputValue as any);
                }
                onChange?.(e as any, inputValue as any, 'createOption');
            }

            setInputValue('');
            setIsOpen(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValue = multiple ? [] : null;
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(e as any, newValue as any, 'clear');
        setInputValue('');
        inputRef.current?.focus();
    };

    const handleRemoveTag = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (readOnly) return;

        const valueArray = (value as Value[]) || [];
        const newValue = valueArray.filter((_, i) => i !== index);
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(e as any, newValue as any, 'removeOption');
    };

    const isSelected = (option: Value) => {
        if (multiple) {
            return ((value as Value[]) || []).some(v => isOptionEqualToValue(option, v));
        }
        return value ? isOptionEqualToValue(option, value as Value) : false;
    };

    const renderValue = () => {
        if (multiple) {
            const valueArray = (value as Value[]) || [];
            const displayTags = limitTags > 0 ? valueArray.slice(0, limitTags) : valueArray;
            const remainingCount = limitTags > 0 ? valueArray.length - limitTags : 0;

            if (renderTags) {
                return renderTags(valueArray, (index: number) => ({
                    key: index,
                    onDelete: (e: React.MouseEvent) => handleRemoveTag(e, index),
                }));
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {displayTags.map((item, index) => (
                        <span
                            key={index}
                            className={`inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm ${chipClassName}`}
                        >
                            {getOptionLabel(item)}
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={(e) => handleRemoveTag(e, index)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </span>
                    ))}
                    {remainingCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-sm text-sm">
                            +{remainingCount}
                        </span>
                    )}
                </div>
            );
        }
        return null;
    };

    const hasValue = multiple ? ((value as Value[]) || []).length > 0 : value !== null && value !== undefined;
    const showClearButton = !disableClearable && hasValue && !disabled && !readOnly;

    return (
        <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : 'w-64'} ${className}`}>
            {label && (
                <label className={`block mb-1 text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
                    {label}
                </label>
            )}

            <div
                className={`flex items-center flex-wrap gap-1 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
                    } ${readOnly ? 'cursor-default' : ''}`}
                onClick={() => !disabled && !readOnly && inputRef.current?.focus()}
            >
                {multiple && renderValue()}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && !readOnly && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={multiple && hasValue ? '' : placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={`flex-1 bg-transparent outline-hidden ${multiple && hasValue ? 'min-w-[120px]' : ''}`}
                />

                <div className="flex items-center gap-1 shrink-0">
                    {showClearButton && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    )}

                    <button
                        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        type="button"
                        disabled={disabled || readOnly}
                    >
                        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {helperText && (
                <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {helperText}
                </p>
            )}

            {isOpen && !disabled && !readOnly && (
                <div
                    className={`absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}
                >
                    {loading ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">{loadingText}</div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => {
                            const selected = isSelected(option);
                            const defaultProps = {
                                onClick: (e: React.MouseEvent<HTMLLIElement>) => handleOptionClick(e, option),
                                className: `px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${selected ? 'bg-blue-100' : ''
                                    }`,
                            };

                            if (renderOption) {
                                return (
                                    <li key={index} {...defaultProps}>
                                        {renderOption(defaultProps, option, { selected })}
                                    </li>
                                );
                            }

                            return (
                                <div key={index} {...defaultProps as any}>
                                    <div className="flex items-center justify-between">
                                        <span>{getOptionLabel(option)}</span>
                                        {multiple && selected && (
                                            <span className="text-blue-600">✓</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">{noOptionsText}</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Autocomplete;
