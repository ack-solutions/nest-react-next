// @mui
import { alpha } from '@mui/material/styles';
import { palette as themePalette } from '../palette';
import { omit } from 'lodash';

export function presets(presetsColor: string) {
	const primary = primaryPresets.find((i) => i.name === presetsColor);

	const theme = {
		palette: {
			primary: omit(primary, ['name'])
		},
		customShadows: {
			primary: `0 8px 16px 0 ${alpha(`${primary?.main}`, 0.24)}`
		}
	};

	return theme;
}


const palette = themePalette('light');

export const primaryPresets = [
	// DEFAULT
	{
		name: 'default',
		lighter: '#bac0d1',
		light: '#657192',
		main: '#293b6b',
		dark: '#15234d',
		darker: '#0b1436',
		contrastText: '#FFFFFF',
		// lighter: 'rgb(185, 106, 174)', // increased each RGB value
		// light: 'rgb(167, 89, 157)', // slightly increased each RGB value
		// main: 'rgb(152, 73, 141)', // original color
		// dark: 'rgb(137, 58, 126)', // slightly decreased each RGB value
		// darker: 'rgb(122, 43, 111)', // decreased each RGB value
		// contrastText: '#FFFFFF'
	},
	// CYAN
	{
		name: 'cyan',
		lighter: '#CCF4FE',
		light: '#68CDF9',
		main: '#078DEE',
		dark: '#0351AB',
		darker: '#012972',
		contrastText: '#FFFFFF'
	},

	// PURPLE
	{
		name: 'purple',
		lighter: '#EBD6FD',
		light: '#B985F4',
		main: '#7635dc',
		dark: '#431A9E',
		darker: '#200A69',
		contrastText: '#FFFFFF'
	},
	// BLUE
	{
		name: 'blue',
		lighter: '#D1E9FC',
		light: '#76B0F1',
		main: '#2065D1',
		dark: '#103996',
		darker: '#061B64',
		contrastText: '#FFFFFF'
	},
	// ORANGE
	{
		name: 'orange',
		lighter: '#FEF4D4',
		light: '#FED680',
		main: '#fda92d',
		dark: '#B66816',
		darker: '#793908',
		contrastText: palette.grey[800]
	},
	// RED
	{
		name: 'red',
		lighter: '#FFE3D5',
		light: '#FFC1AC',
		main: '#FF3030',
		dark: '#B71833',
		darker: '#7A0930',
		contrastText: '#FFFFFF'
	}
];