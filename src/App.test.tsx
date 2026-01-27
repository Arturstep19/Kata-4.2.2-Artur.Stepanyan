import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import App from './App';

const mockProducts = [
  {
    id: 1,
    name: 'Carrot',
    price: 56,
    image: 'carrot.jpg',
    category: 'vegetable',
  },
];

describe('App Component', () => {
  beforeEach(() => {
    // Используем window вместо global
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders header with shop name', async () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Vegetable')).toBeInTheDocument();
    });

    expect(screen.getByText('SHOP')).toBeInTheDocument();
  });

  test('shows cart button', async () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );

    await waitFor(() => {
      const cartButton = screen.getByRole('button', { name: /cart/i });
      expect(cartButton).toBeInTheDocument();
    });
  });

  test('shows loading skeletons initially', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );

    const skeletons = document.querySelectorAll('.mantine-Skeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});