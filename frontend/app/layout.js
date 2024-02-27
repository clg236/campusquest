import localFont from 'next/font/local'
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

const handwriting = localFont({
  src: [
    {
      path: './fonts/CarlosHandwriting-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/CarlosTerribleHandwriting120-Regular.otf',
      weight: '700',
      style: 'bold',
    },
  ],
  display: 'swap',
})

export const metadata = {
  title: "CampusQuest",
  description: "Made by Professor Grewell",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${handwriting.className} font-sans`}>
      <head>
        <ColorSchemeScript />
      </head>
      <body><MantineProvider theme={theme}>{children}</MantineProvider></body>
    </html>
  );
}
