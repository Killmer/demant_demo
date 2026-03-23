const greys = [
  '0100',
  '0150',
  '0200',
  '0250',
  '0300',
  '0350',
  '0400',
  '0450',
  '0500',
  '0600',
  '0700',
  '0750',
  '0800',
  '0850',
  '0900',
  '0925',
  '0950',
  '1000',
];
const greyDefs = (() => {
  const result = {};
  greys.forEach((entry) => {
    result[`grey-${entry}`] = `rgb(var(--color-grey-${entry}-raw) / <alpha-value>)`;
  });

  return result;
})();

const rights = ['0100', '0200', '0300', '0400', '0500', '0600', '0700', '0800', '0900'];
const rightDefs = (() => {
  const result = {};
  rights.forEach((entry) => {
    result[`right-${entry}`] = `rgb(var(--color-right-${entry}-raw) / <alpha-value>)`;
  });

  return result;
})();

const lefts = ['0100', '0200', '0300', '0400', '0500', '0600', '0700', '0800', '0900'];
const leftDefs = (() => {
  const result = {};
  lefts.forEach((entry) => {
    result[`left-${entry}`] = `rgb(var(--color-left-${entry}-raw) / <alpha-value>)`;
  });

  return result;
})();

const systemColors = [
  'white',
  'black',
  'success',
  'success-light',
  'info',
  'info-dark',
  'info-light',
  'warning',
  'warning-light',
  'notification',
  'error',
  'error-light',
];
const systemColorDefs = (() => {
  const result = {};
  systemColors.forEach((entry) => {
    result[`${entry}`] = `rgb(var(--color-${entry}-raw) / <alpha-value>)`;
  });

  return result;
})();

const pxToRem = (px) => `${px / 16}rem`;
const sizeToRem = (size) => `${size / 4}rem`;

const sizes = (() => {
  const result = [];

  for (let i = 0; i < 12; i++) {
    result.push(i);

    if (i < 4) {
      result.push(i + 0.5);
    }
  }

  result.push(14);

  for (let i = 16; i <= 64; i += 4) {
    result.push(i);
  }

  return result;
})();

const borderRadiusDefs = (() => {
  const result = {};

  sizes.forEach((size) => {
    result[size] = sizeToRem(size);
  });

  return result;
})();

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/sitecore/components/**/*.{js,ts,jsx,tsx}',
    './src/sitecore/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      'page-title': [
        'var(--size-page-title)',
        {
          lineHeight: '1.2',
        },
      ],
      'head-1': [
        'var(--size-head-1)',
        {
          lineHeight: '1.2',
        },
      ],
      'head-2': [
        'var(--size-head-2)',
        {
          lineHeight: '1.2',
        },
      ],
      'head-3': [
        'var(--size-head-3)',
        {
          lineHeight: '1.2',
        },
      ],
      'head-4': [
        'var(--size-head-4)',
        {
          lineHeight: '1.2',
          fontWeight: 'var(--medium-font-weight)',
        },
      ],
      'subhead-1': [
        'var(--size-subhead-1)',
        {
          lineHeight: '1.2',
        },
      ],
      'subhead-2': [
        'var(--size-subhead-2)',
        {
          lineHeight: '1.2',
          fontWeight: 'var(--medium-font-weight)',
        },
      ],
      regular: [
        'var(--size-regular)',
        {
          lineHeight: '1.4',
        },
      ],
      small: [
        'var(--size-small)',
        {
          lineHeight: '1.4',
        },
      ],
      extraSmall: [pxToRem(11)],
      tiny: [
        'var(--size-tiny)',
        {
          lineHeight: '1.4',
        },
      ],
      table: [
        'var(--size-table)',
        {
          lineHeight: '1.2',
        },
      ],
      tile: [
        'var(--size-tile)',
        {
          lineHeight: '1.3',
        },
      ], 
    },
    lineHeight: {
      none: '1',
      normal: '1.2',
      text: '1.4',
      link: '1.6',
    },

    extend: {
      fontWeight: {
        medium: 'var(--medium-font-weight)',
      },
      colors: {
        corporate: 'rgb(var(--color-corporate-raw) / <alpha-value>)',
        primary: 'rgb(var(--color-primary-raw) / <alpha-value>)',
        'primary-weblink': 'rgb(var(--color-primary-weblink-raw) / <alpha-value>)',
        'primary-weblink-hover': 'rgb(var(--color-primary-weblink-hover-raw) / <alpha-value>)',
        'surface-brand': 'rgb(var(--color-surface-brand-raw) / <alpha-value>)',
        'surface-brand-medium': 'rgb(var(--color-surface-brand-medium-raw) / <alpha-value>)',
        'surface-brand-dark': 'rgb(var(--color-surface-brand-dark-raw) / <alpha-value>)',
        'surface-brand-secondary-dark':
          'rgb(var(--color-surface-brand-secondary-dark-raw) / <alpha-value>)',
        'surface-brand-tertiary': 'rgb(var(--color-surface-brand-tertiary-raw) / <alpha-value>)',
        'surface-card-primary': 'rgb(var(--color-surface-card-primary-raw) / <alpha-value>)',
        header: 'rgb(var(--color-text-header-raw) / <alpha-value>)',
        'link-dark': 'rgb(var(--color-text-link-dark-raw) / <alpha-value>)',
        'sitecore-highlight-1': 'rgb(var(--color-bg-sitecore-light-1-raw) / <alpha-value>)',
        'sitecore-highlight-2': 'rgb(var(--color-bg-sitecore-light-2-raw) / <alpha-value>)',
        'sitecore-secondary-deep-1': 'rgb(var(--color-bg-sitecore-dark-1-raw) / <alpha-value>)',
        'sitecore-secondary-deep-2': 'rgb(var(--color-bg-sitecore-dark-2-raw) / <alpha-value>)',
        ...greyDefs,
        ...rightDefs,
        ...leftDefs,
        ...systemColorDefs,
      },
      boxShadow: {
        e1: '0px 2px 40px rgba(0, 0, 0, 0.07), 0px 3px 16px rgba(0, 0, 0, 0.03)',
        e2: '0px 2px 40px rgba(0, 0, 0, 0.15), 0px 3px 16px rgba(0, 0, 0, 0.07)',
        e5: '0px 2px 40px rgba(0, 0, 0, 0.3), 0px 3px 16px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        print: { raw: 'print' },
        mediumHighDesktop: { raw: '(max-height: 1000px)' },
        mediumDesktop: { raw: '(max-height: 900px)' },
        smallDesktop: { raw: '(max-height: 800px)' },
        smallestDesktop: { raw: '(max-height: 685px)' },
        sitecoreStartLargeGrid: '1081px',
        '2.5xl': '1680px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      borderWidth: {
        6: '6px',
      },
      borderRadius: {
        '4xl': '2rem',
        ...borderRadiusDefs,
      },
      backgroundColor: {
        corporate: 'var(--color-corporate)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-linear': 'linear-gradient(var(--tw-gradient-stops))',
        forceable:
          'linear-gradient(to top left, transparent 49%, var(--color-grey-0700) 50%, var(--color-grey-0700) 51%, transparent 52%)',
      },
      fontFamily: {
        barcode: ['var(--font-libre)', 'monospace'],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('children', '& > *');
    },
  ],
};
