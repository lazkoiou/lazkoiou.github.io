// Each demo drives the whole showcase: the spec shown on screen, the mock app the
// "browser" renders, and the scripted steps the simulator replays.
// `line` is the 1-based line of `spec` that a step is executing.

export type MockElement =
  | { id: string; type: 'heading' | 'text' | 'button'; text: string }
  | { id: string; type: 'input'; label: string; mask?: boolean }
  | { id: string; type: 'alert' };

export interface Step {
  line: number;
  kind: 'goto' | 'fill' | 'click' | 'expect';
  target?: string;
  /** goto: path; fill: text to type */
  value?: string;
  /** Human-readable step for the terminal/report */
  log: string;
  /** App changes applied after the step: switch screen and/or set element text */
  set?: { screen?: string; text?: Record<string, string> };
  /** expect only: the assertion fails */
  fail?: boolean;
  error?: string;
}

export interface DemoTest {
  name: string;
  /** line of the `test(` call in the spec */
  line: number;
  /** only run when "include a failing test" is ticked */
  optional?: boolean;
  steps: Step[];
}

export interface Demo {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  file: string;
  describe?: string;
  baseUrl: string;
  spec: string;
  app: { screens: Record<string, MockElement[]> };
  tests: DemoTest[];
  highlights: string[];
}

const loginSpec = `import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('valid user reaches the dashboard', async ({ page }) => {
    await page.getByLabel('Email').fill('qa@example.com');
    await page.getByLabel('Password').fill('s3cret-pass');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('wrong password shows an error', async ({ page }) => {
    await page.getByLabel('Email').fill('qa@example.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toHaveText('Invalid credentials');
  });

  test('locked account shows a lock message', async ({ page }) => {
    await page.getByLabel('Email').fill('locked@example.com');
    await page.getByLabel('Password').fill('s3cret-pass');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toHaveText('Account locked');
  });
});`;

const checkoutSpec = `import { test, expect } from '@playwright/test';

test('adds an item to the cart', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-count')).toHaveText('Cart (1)');
});

test('completes checkout', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByTestId('cart-count').click();
  await expect(page.getByText('Total: $12.00')).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
});`;

export const demos: Demo[] = [
  {
    id: 'login-flow',
    title: 'Login flow',
    summary:
      'Authentication coverage with role-based locators: the happy path, a rejected password and a locked account, with one deliberately failing check to show how failures are reported.',
    tags: ['Playwright', 'TypeScript', 'Locators', 'Assertions'],
    file: 'login.spec.ts',
    describe: 'Login',
    baseUrl: 'https://demo.example.com',
    spec: loginSpec,
    highlights: [
      'Accessible, role-based locators instead of brittle CSS selectors',
      'A beforeEach hook keeps every test independent',
      'Web-first assertions that auto-wait, with no manual sleeps',
      'The failing test shows what a useful failure report looks like',
    ],
    app: {
      screens: {
        login: [
          { id: 'title', type: 'heading', text: 'Sign in' },
          { id: 'email', type: 'input', label: 'Email' },
          { id: 'password', type: 'input', label: 'Password', mask: true },
          { id: 'alert', type: 'alert' },
          { id: 'submit', type: 'button', text: 'Sign in' },
        ],
        dashboard: [
          { id: 'heading', type: 'heading', text: 'Dashboard' },
          { id: 'welcome', type: 'text', text: 'Welcome back, qa@example.com' },
        ],
      },
    },
    tests: [
      {
        name: 'valid user reaches the dashboard',
        line: 8,
        steps: [
          { line: 5, kind: 'goto', value: '/login', log: "page.goto('/login')", set: { screen: 'login' } },
          { line: 9, kind: 'fill', target: 'email', value: 'qa@example.com', log: "getByLabel('Email').fill()" },
          { line: 10, kind: 'fill', target: 'password', value: 's3cret-pass', log: "getByLabel('Password').fill()" },
          { line: 11, kind: 'click', target: 'submit', log: "getByRole('button', { name: 'Sign in' }).click()", set: { screen: 'dashboard' } },
          { line: 12, kind: 'expect', target: 'heading', log: "expect(heading 'Dashboard').toBeVisible()" },
        ],
      },
      {
        name: 'wrong password shows an error',
        line: 15,
        steps: [
          { line: 5, kind: 'goto', value: '/login', log: "page.goto('/login')", set: { screen: 'login' } },
          { line: 16, kind: 'fill', target: 'email', value: 'qa@example.com', log: "getByLabel('Email').fill()" },
          { line: 17, kind: 'fill', target: 'password', value: 'wrong', log: "getByLabel('Password').fill()" },
          { line: 18, kind: 'click', target: 'submit', log: "getByRole('button', { name: 'Sign in' }).click()", set: { text: { alert: 'Invalid credentials' } } },
          { line: 19, kind: 'expect', target: 'alert', log: "expect(alert).toHaveText('Invalid credentials')" },
        ],
      },
      {
        name: 'locked account shows a lock message',
        line: 22,
        optional: true,
        steps: [
          { line: 5, kind: 'goto', value: '/login', log: "page.goto('/login')", set: { screen: 'login' } },
          { line: 23, kind: 'fill', target: 'email', value: 'locked@example.com', log: "getByLabel('Email').fill()" },
          { line: 24, kind: 'fill', target: 'password', value: 's3cret-pass', log: "getByLabel('Password').fill()" },
          { line: 25, kind: 'click', target: 'submit', log: "getByRole('button', { name: 'Sign in' }).click()", set: { text: { alert: 'Invalid credentials' } } },
          {
            line: 26,
            kind: 'expect',
            target: 'alert',
            log: "expect(alert).toHaveText('Account locked')",
            fail: true,
            error: 'Expected string: "Account locked"\nReceived string: "Invalid credentials"',
          },
        ],
      },
    ],
  },
  {
    id: 'checkout-flow',
    title: 'Shop checkout',
    summary:
      'A multi-page purchase journey: add to cart, review the cart total and confirm the order. Shows navigation across screens and assertions on state that changes between pages.',
    tags: ['Playwright', 'E2E', 'Test IDs', 'Multi-page'],
    file: 'checkout.spec.ts',
    baseUrl: 'https://demo.example.com',
    spec: checkoutSpec,
    highlights: [
      'End-to-end journey across three screens',
      'Stable data-testid hooks for elements without an accessible name',
      'Assertions after every state change, not only at the end',
      'Each test sets up its own state, so tests can run in parallel',
    ],
    app: {
      screens: {
        shop: [
          { id: 'title', type: 'heading', text: 'Shop' },
          { id: 'item', type: 'text', text: 'Blue Notebook · $12.00' },
          { id: 'add', type: 'button', text: 'Add to cart' },
          { id: 'cartcount', type: 'button', text: 'Cart (0)' },
        ],
        cart: [
          { id: 'carttitle', type: 'heading', text: 'Your cart' },
          { id: 'line', type: 'text', text: 'Blue Notebook × 1' },
          { id: 'total', type: 'text', text: 'Total: $12.00' },
          { id: 'checkout', type: 'button', text: 'Checkout' },
        ],
        done: [
          { id: 'confirmed', type: 'heading', text: 'Order confirmed' },
          { id: 'receipt', type: 'text', text: 'A receipt was sent to qa@example.com' },
        ],
      },
    },
    tests: [
      {
        name: 'adds an item to the cart',
        line: 3,
        steps: [
          { line: 4, kind: 'goto', value: '/shop', log: "page.goto('/shop')", set: { screen: 'shop' } },
          { line: 5, kind: 'click', target: 'add', log: "getByRole('button', { name: 'Add to cart' }).click()", set: { text: { cartcount: 'Cart (1)' } } },
          { line: 6, kind: 'expect', target: 'cartcount', log: "expect(cart-count).toHaveText('Cart (1)')" },
        ],
      },
      {
        name: 'completes checkout',
        line: 9,
        steps: [
          { line: 10, kind: 'goto', value: '/shop', log: "page.goto('/shop')", set: { screen: 'shop' } },
          { line: 11, kind: 'click', target: 'add', log: "getByRole('button', { name: 'Add to cart' }).click()", set: { text: { cartcount: 'Cart (1)' } } },
          { line: 12, kind: 'click', target: 'cartcount', log: "getByTestId('cart-count').click()", set: { screen: 'cart' } },
          { line: 13, kind: 'expect', target: 'total', log: "expect(text 'Total: $12.00').toBeVisible()" },
          { line: 14, kind: 'click', target: 'checkout', log: "getByRole('button', { name: 'Checkout' }).click()", set: { screen: 'done' } },
          { line: 15, kind: 'expect', target: 'confirmed', log: "expect(heading 'Order confirmed').toBeVisible()" },
        ],
      },
    ],
  },
];
