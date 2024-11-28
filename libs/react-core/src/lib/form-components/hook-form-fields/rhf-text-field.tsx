import { TextField, TextFieldProps, useForkRef } from '@mui/material'
import {
	Control,
	useController,
} from 'react-hook-form'
import { forwardRef, Ref } from 'react'

export type RHFTextFieldProps = Omit<TextFieldProps, 'name'> & {
	name: string;
	control?: Control;
	component?: typeof TextField
}

export const RHFTextField = forwardRef((
	props: RHFTextFieldProps,
	ref: Ref<HTMLDivElement>
) => {

	const {
		name,
		control,
		component: TextFieldComponent = TextField,
		inputRef,
		onBlur,
		...rest
	} = props

	const {
		field,
		fieldState: { error },
	} = useController({
		name,
		control,
		disabled: rest.disabled,
	})

	const handleInputRef = useForkRef(field.ref, inputRef)

	return (
		<TextFieldComponent
			{...rest}
			name={field.name}
			value={field.value}
			onChange={(event) => {
				field.onChange(event)
				if (typeof rest.onChange === 'function') {
					rest.onChange(event)
				}
			}}
			onBlur={(event) => {
				field.onBlur()
				if (typeof onBlur === 'function') {
					onBlur(event)
				}
			}}
			error={!!error}
			helperText={error ? error.message : rest.helperText}
			ref={ref}
			inputRef={handleInputRef}
		/>
	)
})
