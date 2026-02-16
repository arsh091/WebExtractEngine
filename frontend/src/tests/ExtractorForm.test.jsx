import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ExtractorForm from '../components/ExtractorForm';

describe('ExtractorForm', () => {
    test('renders input field', () => {
        render(<ExtractorForm onExtract={vi.fn()} onReset={vi.fn()} loading={false} inputRef={{ current: null }} />);
        const input = screen.getByPlaceholderText(/enter website url/i);
        expect(input).toBeInTheDocument();
    });

    test('validates URL on submit', () => {
        const mockExtract = vi.fn();
        render(<ExtractorForm onExtract={mockExtract} onReset={vi.fn()} loading={false} inputRef={{ current: null }} />);

        const input = screen.getByPlaceholderText(/enter website url/i);
        const button = screen.getByRole('button', { name: /extract intelligence/i });

        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        expect(mockExtract).not.toHaveBeenCalled();
    });
});
