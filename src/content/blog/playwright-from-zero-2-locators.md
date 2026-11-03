---
title: "Playwright from zero, part 2: locators that survive redesigns"
description: "Prefer role and label locators over CSS selectors, and know when a test id is the right tool."
date: 2026-10-08
tags: [playwright, locators]
series: "Playwright from zero"
order: 2
---

> Sample post: replace it with your own writing, or delete this file.

A locator is how a test finds an element. The choice you make here is the biggest factor in how often tests break.

## Order of preference

1. **Role**: `getByRole('button', { name: 'Sign in' })`
2. **Label**: `getByLabel('Email')`
3. **Text**: `getByText('Order confirmed')`
4. **Test id**: `getByTestId('cart-count')`, for elements with no accessible name
5. **CSS/XPath**: a last resort

## Why roles first

Role locators mirror how users and assistive technology see the page. If the button's text changes, the test fails *for a reason that matters*. If a developer renames a CSS class, it keeps passing.

```ts
// Brittle: coupled to markup
await page.locator('div.form > div:nth-child(3) button.btn-primary').click();

// Resilient: coupled to behaviour
await page.getByRole('button', { name: 'Sign in' }).click();
```

## When test ids are right

Use `data-testid` when nothing user-facing identifies the element, for example a counter badge. Configure the attribute once:

```ts
// playwright.config.ts
export default defineConfig({
  use: { testIdAttribute: 'data-testid' },
});
```

## Takeaway

Write locators the way you'd describe the element to a person. See them in action in the [Login flow demo](/projects/login-flow).
