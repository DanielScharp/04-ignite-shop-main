// Importação da função "globalCss" do pacote "@stitches/react"
import { globalCss } from ".";

// Criação de uma constante "globalStyles" que contém o objeto de estilo global
export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: 'Roboto',
    fontWeight: 400,
  }
})
