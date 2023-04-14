/*
 * Este é um código em JavaScript que usa o pacote "@stitches/react" para criar estilos em um aplicativo React.
 * A função "createStitches" é usada para criar um objeto que contém várias propriedades que podem ser usadas para criar e estilizar componentes React.
*/
import { createStitches } from "@stitches/react";

// Criação do objeto contendo diversas propriedades para estilizar componentes React
export const {
  config, 
  styled, 
  css, 
  globalCss, 
  keyframes, 
  getCssText, 
  theme, 
  createTheme,
} = createStitches({
  theme: {
    colors: {
      white: '#FFF',

      gray900: '#121214',
      gray800: '#202024',
      gray300: '#c4c4cc',
      gray100: '#e1e1e6',

      green500: '#00875f',
      green300: '#00b37e',
    },

    fontSizes: {
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    }
  }
})
