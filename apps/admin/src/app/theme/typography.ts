export function responsiveFontSizes({ sm, md, lg }: { sm?: number; md?: number; lg?: number }) {
	return {
		...(sm ? {
			'@media (min-width:600px)': {
				fontSize: sm
			}
		} : {}),
		...(md ? {
			'@media (min-width:900px)': {
				fontSize: md
			}
		} : {}),
		...(lg ? {
			'@media (min-width:1200px)': {
				fontSize: lg
			}
		} : {}),
	}
}

declare module '@mui/material/styles' {
	interface TypographyVariants {
		fontWeightSemiBold: React.CSSProperties['fontWeight'];
	}
}
// export const primaryFont = Public_Sans({
// 	weight: ['400', '500', '600', '700', '800'],
// 	subsets: ['latin'],
// 	display: 'swap',
// 	fallback: ['Helvetica', 'Arial', 'sans-serif']
// });

// export const secondaryFont = Barlow({
// 	weight: ['900'],
// 	subsets: ['latin'],
// 	display: 'swap',
// 	fallback: ['Helvetica', 'Arial', 'sans-serif']
// });

export const typography = {
	//fontFamily: primaryFont.style.fontFamily,
	fontWeightRegular: 400,
	fontWeightMedium: 500,
	fontWeightSemiBold: 600,
	fontWeightBold: 700,
	h1: {
		fontWeight: 800,
		lineHeight: 80 / 64,
		fontSize: 28,
		...responsiveFontSizes({ sm: 52, md: 58, lg: 64 })
	},
	h2: {
		fontWeight: 800,
		lineHeight: 64 / 48,
		fontSize: 24,
		...responsiveFontSizes({ sm: 22, md: 24 })
	},
	h3: {
		fontWeight: 700,
		lineHeight: 1.5,
		fontSize: 20,
		...responsiveFontSizes({ sm: 18, md: 20 })
	},
	h4: {
		fontWeight: 700,
		lineHeight: 1.5,
		fontSize: 18,
		...responsiveFontSizes({ sm: 16, md: 18 })
	},
	h5: {
		fontWeight: 700,
		lineHeight: 1.5,
		fontSize: 16,
		...responsiveFontSizes({ sm: 14, md: 16 })
	},
	h6: {
		fontWeight: 700,
		lineHeight: 28 / 18,
		fontSize: 14,
		...responsiveFontSizes({ sm: 12, md: 14 })
	},
	subtitle1: {
		fontWeight: 600,
		lineHeight: 1.5,
		fontSize: 16,
		...responsiveFontSizes({ sm: 14, md: 16 }),
	},
	subtitle2: {
		fontWeight: 600,
		lineHeight: 22 / 14,
		fontSize: 14,
		...responsiveFontSizes({ sm: 12, md: 14 }),
	},
	body1: {
		lineHeight: 1.5,
		fontSize: 16,
		...responsiveFontSizes({ sm: 14, md: 14 }),
	},
	body2: {
		lineHeight: 22 / 14,
		fontSize: 14
	},
	caption: {
		lineHeight: 1.5,
		fontSize: 12
	},
	overline: {
		fontWeight: 700,
		lineHeight: 1.5,
		fontSize: 12,
		textTransform: 'uppercase'
	},
	button: {
		fontWeight: 700,
		lineHeight: 24 / 14,
		fontSize: 14,
		textTransform: 'unset'
	}
} as const;
