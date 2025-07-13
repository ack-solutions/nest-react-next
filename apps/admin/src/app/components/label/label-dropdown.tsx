import { MenuItem } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';

import { Label, LabelProps } from './label';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';


export interface LabelDropdownProps extends Partial<LabelProps> {
    options?: any[];
    selected?: any;
    onChange?: (option: any) => void;
    renderOption?: (option: any) => ReactNode;
    anchor?: any;
}

export function LabelDropdown({
    children,
    renderOption,
    selected,
    options,
    onChange,
    anchor,
    ...other
}: LabelDropdownProps) {
    return (
        <MenuDropdown
            anchor={
                anchor || (
                    <Label
                        title={selected}
                        endIcon={(
                            <Icon
                                icon={IconEnum.ChevronDown}
                                size={8}
                            />
                        )}
                        {...(other as any)}
                    >
                        {selected}
                    </Label>
                )
            }
        >
            {({ handleClose }) => options?.map((option) => renderOption ? (
                <MenuItem
                    key={option}
                    onClick={(event) => {
                        event?.preventDefault();
                        event?.stopPropagation();
                        onChange(option);
                        handleClose();
                    }}
                    sx={{
                        justifyContent: 'center',
                    }}
                >
                    {renderOption(option)}
                </MenuItem>
            ) : (
                <MenuItem
                    key={option}
                    selected={selected === option}
                    onClick={(event) => {
                        event?.preventDefault();
                        event?.stopPropagation();
                        onChange(option);
                        handleClose();
                    }}
                >
                    {startCase(option)}
                </MenuItem>
            ))
            }
        </MenuDropdown>
    );
}
