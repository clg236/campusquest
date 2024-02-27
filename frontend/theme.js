'use client'
import { createTheme, rem } from '@mantine/core';

const randomRPGColors = [
    'rgba(143, 89, 52, 1)',  // Brown (Earth)
    'rgba(77, 116, 85, 1)',  // Dark green (Forest)
    'rgba(184, 134, 11, 1)', // Gold (Treasure)
    'rgba(165, 42, 42, 1)',  // Dark red (Blood/Danger)
    'rgba(75, 83, 32, 1)',   // Olive (Camouflage)
  ];
  

// Function to select a random color from the vaporwave colors array
export const getRandomRPGColor = () => {
    const randomIndex = Math.floor(Math.random() * randomRPGColors.length);
    return randomRPGColors[randomIndex];
  };
// Select a random vaporwave color to be the primary theme color
const randomPrimaryColor = getRandomRPGColor();

// Generate a primary color scheme using the random vaporwave color
// Since we need an array of colors for each color level, we use the random color for all shades.
const generatePrimaryShades = (color) => Array(10).fill(color);

export const theme = createTheme({
    fontFamily: 'Carlos Handwriting, Inter, sans-serif',
    fontFamilyMonospace: '"Carlos Handwriting", Monaco, Courier, monospace',
    headings: { fontFamily: '"Carlos Handwriting", Inter, sans-serif' },
    fontSizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 20,
        },
    primaryColor: 'dark-purple',
    colors: {
      'random-vaporwave': generatePrimaryShades(randomPrimaryColor),
      'dark-purple' : [
        "#faedff",
        "#edd9f7",
        "#d8b1ea",
        "#c286dd",
        "#ae62d2",
        "#a24bcb",
        "#9e3fc9",
        "#8931b2",
        "#7b2aa0",
        "#6b218d"
      ],
      'google' : [
        "#e5f4ff",
        "#cde2ff",
        "#9bc2ff",
        "#64a0ff",
        "#3984fe",
        "#1d72fe",
        "#0969ff",
        "#0058e4",
        "#004ecc",
        "#0043b5"
      ]
    },
    shadows: {
      customButtonShadow: `4px 4px 0px ${getRandomRPGColor()}`,
    },
    components: {
          Menu: {
            styles: (theme) => ({
              root:{
                  // root element
              },
              label: {
                  textAlign: 'left',
                  fontSize: rem(25),
              },
            input: {
              fontSize: rem(15),
              border: `${rem(2)} solid #000`,
              boxShadow: theme.shadows.customInputShadow,
              height: rem(60), // Adjust based on your preference
              padding: `0 ${rem(20)}`,
              borderRadius: rem(10),
              backgroundColor: '#FFF', // Adjust background color as needed
            },
            // Apply styles to other parts as needed, e.g., wrapper or icon
          }),
          },
          CheckboxGroup: {
            styles: (theme) => ({
                root:{
                    // root element
                },
                label: {
                    textAlign: 'left',
                    fontSize: rem(25),
                },
              input: {
                fontSize: rem(15),
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customInputShadow,
                height: rem(60), // Adjust based on your preference
                padding: `0 ${rem(20)}`,
                borderRadius: rem(10),
                backgroundColor: '#FFF', // Adjust background color as needed
              },
              // Apply styles to other parts as needed, e.g., wrapper or icon
            }),
          },
          TextInput: {
            styles: (theme) => ({
                root:{
                    // root element
                },
                label: {
                    textAlign: 'left',
                    fontSize: rem(20),
                },
              input: {
                fontSize: rem(20),
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customInputShadow,
                height: rem(60), // Adjust based on your preference
                padding: `${rem(20)} ${rem(20)}`,
                borderRadius: rem(10),
                backgroundColor: '#FFF', // Adjust background color as needed
              },
              // Apply styles to other parts as needed, e.g., wrapper or icon
            }),
          },
          Textarea: {
            styles: (theme) => ({
                root:{
                },
                label: {
                    textAlign: 'left',
                    fontSize: rem(20),
                },
              input: {
                fontSize: rem(20),
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customInputShadow,
                padding: `${rem(20)} ${rem(20)}`,
                borderRadius: rem(10),
                backgroundColor: '#FFF', // Adjust background color as needed
              },
              // Apply styles to other parts as needed, e.g., wrapper or icon
            }),
          },
          TagsInput: {
            styles: (theme) => ({
                root:{
                    // root element
                },
                label: {
                    textAlign: 'left',
                    fontSize: rem(20),
                },
                inputField: {
                  textAlign: 'left',
                  fontSize: rem(20),
              },
                pill: {
                  fontSize: rem(20),
                },
              input: {
                fontSize: rem(20),
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customInputShadow,
                padding: `${rem(10)} ${rem(20)}`,
                borderRadius: rem(10),
                backgroundColor: '#FFF', // Adjust background color as needed
              },
              // Apply styles to other parts as needed, e.g., wrapper or icon
            }),
          },
          Select: {
            styles: (theme) => ({
              root:{
                  // root element
              },
              label: {
                  textAlign: 'left',
                  fontSize: rem(25),
              },
            input: {
              padding: `0 ${rem(20)}`,
              border: `${rem(2)} solid #000`,
              fontSize: rem(15),
              boxShadow: theme.shadows.customInputShadow,
              //padding: `0 ${rem(2)}`,
              borderRadius: rem(5),
            },
            // Apply styles to other parts as needed, e.g., wrapper or icon
          }),
          },

    ActionIcon: {
      styles: (theme, { variant }) => {
        if (variant === 'delete-icon') {
          return {
            root: {
              border: `${rem(2)} solid #000`,
              boxShadow: theme.shadows.customButtonShadow,
              '--button-height': rem(60),
              '--button-padding': `0 ${rem(30)}`,
              '--button-radius': rem(10),
              '--button-border': '2px solid #000',
              
            },
            inner: {
              // inner css
            },
            label: {
              fontSize: rem(25),
              //backgroundImage: gradient,
            }
          };
        }
      }
    },
    Paper: {
      styles: (theme) => ({
        root: {
          // Use the same border, shadow, and any other styling applied to Button
          border: `${rem(2)} solid #000`,
          boxShadow: theme.shadows.customButtonShadow,
          borderRadius: rem(10), // Match the border-radius from your Button styles
          
        },
        // You can also target other parts of the Paper component here if needed
      }),
    },
    Modal: {
      styles: (theme) => ({
        header: {
          //padding: rem(5),
          //borderBottom: `${rem(4)} solid #000`,
          boxShadow: `0px ${rem(4)} 0 ${rem(0)} ${getRandomRPGColor()}`,
        },
        title: {
          fontSize: rem(25),
        },
        overlay: {
          // overlay css
        },
        body: {
          // body css
        },
        close: {
          // close css
        },
      }),
    },

      Button: {
        styles: (theme, { variant }) => {
          if (variant === 'big-button') {
            return {
              root: {
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customButtonShadow,
                '--button-bg': getRandomRPGColor(),
                '--button-height': rem(60),
                '--button-padding': `0 ${rem(30)}`,
                '--button-radius': rem(10),
                '--button-border': '2px solid #000',
                
              },
              inner: {
                // inner css
              },
              label: {
                fontSize: rem(25),
                //backgroundImage: gradient,
              }
            };
          }

          if (variant === 'big-red-button') {
            return {
              root: {
                border: `${rem(2)} solid #000`,
                boxShadow: theme.shadows.customButtonShadow,
                '--button-bg': '#FF0000',
                '--button-height': rem(60),
                '--button-padding': `0 ${rem(30)}`,
                '--button-radius': rem(10),
                '--button-border': '2px solid #000',
                
              },
              inner: {
                // inner css
              },
              label: {
                fontSize: rem(25),
                //backgroundImage: gradient,
              }
            };
          }

          if (variant === 'big-google') {
            return {
              root: {
                border: `${rem(2)} solid #000`,
                boxShadow: '4px 4px 0px rgba(255, 10, 209, 1)',
                '--button-height': rem(60),
                '--button-padding': `0 ${rem(30)}`,
                '--button-radius': rem(10),
                '--button-border': '2px solid #000',
              },
              inner: {
                // inner css
              },
              label: {
                fontSize: rem(25),
                //backgroundImage: gradient,
              }
            };
          }
        }
      },
    },
  });