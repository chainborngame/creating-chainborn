import { css } from 'styled-components'

const theme = {
  global: {
    colors: {
      brand: 'var(--color-brand)',
      brandLight: 'var(--color-brand-light)',
      brandMiddle: 'var(--color-brand-middle)',
      brandDark: 'var(--color-brand-dark)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      'status-error': 'var(--color-status-error)',
      'status-warning': 'var(--color-status-warning)',
      'status-ok': 'var(--color-status-ok)',
    },
    font: {
      family: 'DM Sans',
      size: '18px',
      height: '20px',
    },
    spacing: 'var(--spacing)',
  },
  tabs: {
    background: 'brandDark',
    gap: 'none',
    header: {
      background: 'brandDark',
      extend: ({ theme }) => css`
        width: 100%;
        justify-content: space-evenly;
      `,
    },
    panel: {
      extend: ({ theme }) => css`
        color: ${theme.global.colors.accent};
        padding: ${theme.global.edgeSize.medium} ${theme.global.edgeSize.large};
        @media (max-width: 480px) {
          padding: ${theme.global.edgeSize.medium};
        }
      `,
    },
  },
  tab: {
    active: {
      background: 'brandMiddle',
      color: 'brand',
    },
    background: 'brandDark',
    border: {
      color: 'brand',
      active: {
        color: 'brand'
      },
      hover: {
        color: 'brand'
      },
    },
    color: 'brand',
    hover: {
      background: 'brandMiddle',
      color: 'brand'
    },
    margin: undefined,
    pad: 'small',
    extend: ({ theme }) => css`
      justify-content: center;
      align-items: center;
      font-weight: bold;
    `,
  },
  button: {
    badge: {
      container: {
        background: 'var(--color-brand)',
        pad: '2px',
      }
    }
  }
}

export default theme
