// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavData } from './nav-config';
import { NAV } from '../../config';
import { NavbarConfigProps } from '../../../types/navigation'; import NavbarToggleButton from './navbar-toggle-button';
import NavbarGroup from './navbar-group';
import { Logo } from '@admin/app/components';

export const hideScroll = {
	x: {
		msOverflowStyle: 'none',
		scrollbarWidth: 'none',
		overflowX: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none'
		}
	},
	y: {
		msOverflowStyle: 'none',
		scrollbarWidth: 'none',
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none'
		}
	}
} as const;

export const navMiniConfig = (config?: NavbarConfigProps) => ({
	itemGap: config?.itemGap || 4,
	iconSize: config?.iconSize || 16,
	currentRole: config?.currentRole,
	itemRootHeight: config?.itemRootHeight || 56,
	itemSubHeight: config?.itemSubHeight || 34,
	itemPadding: config?.itemPadding || '6px 0 0 0',
	itemRadius: config?.itemRadius || 6,
	hiddenLabel: config?.hiddenLabel || false
});

export default function NavbarMini() {
	const navData = useNavData();

	return (
		<Box
			component="nav"
			sx={{
				flexShrink: { lg: 0 },
				width: { lg: NAV.W_MINI }
			}}
		>
			<NavbarToggleButton
				sx={{
					left: NAV.W_MINI - 12
				}}
			/>

			<Stack
				sx={{
					pb: 2,
					height: 1,
					position: 'fixed',
					width: NAV.W_MINI,
					borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
					...hideScroll.x
				}}
			>

				<Logo small sx={{ mx: 'auto', width: 50, my: 2 }} />

				<Stack>
					{navData.map(
						(group, index) => (
							<NavbarGroup
								key={group.subheader || index}
								items={group.items}
								config={navMiniConfig(navMiniConfig())}
								isMini
							/>
						)
					)}
				</Stack>
			</Stack>

		</Box>
	);
}
