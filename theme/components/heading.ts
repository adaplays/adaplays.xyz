import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"
import { brandTextBorder, brandFont } from 'theme/simple'

const brandPrimary = defineStyle({
  ...brandFont
})

const brandUnderline = defineStyle({
  ...brandFont,
  display: 'inline-block',  // this is needed so that width is only as much as children require
  pb: '4px',
  ...brandTextBorder
})

export const headingTheme = defineStyleConfig({
  variants: {
    brand: brandPrimary,
    brandUnderline: brandUnderline,
  },
})
