import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import { expect, it } from 'vitest';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations in LoginPage', async () => {
  const { container } = render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
