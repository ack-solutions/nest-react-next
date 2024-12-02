import { MenuItem } from '@mui/material';
import { Label, LabelProps } from './label';
import { MenuDropdown } from '../menu-dropdown/menu-dropdown';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { ReactNode } from 'react';

export interface LabelDropdownProps extends Partial<LabelProps> {
	options?: any[];
	selected?: any;
	onChange?: (option: any) => void;
	renderOption?: (option: any) => ReactNode;
	getLabel?: (option) => any;
	getValue?: (option) => any;
}


export const LabelDropdown = ({
	children,
	getValue,
	getLabel,
	renderOption,
	selected,
	options,
	onChange,
	...other
}: LabelDropdownProps) => (
	<MenuDropdown
		anchor={
			<Label
				title={getLabel(selected)}
				endIcon={<ArrowDropDownIcon />}
				{...other as any}
			>
				{getLabel(selected)}
			</Label>
		}
	>
		{({ handleClose }) => (
			<>
				{options?.map((option) => renderOption ? renderOption(option) : (
					<MenuItem
						key={getLabel(selected)}
						selected={getValue(selected) === getValue(option)}
						onClick={() => { onChange(option); handleClose() }}
					>
						{getLabel(option)}
					</MenuItem>
				))}
			</>
		)}

	</MenuDropdown>
);
