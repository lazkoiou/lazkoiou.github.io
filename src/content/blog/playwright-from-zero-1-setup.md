---
title: "Playwright from zero, part 1: setup and your first test"
description: "Install Playwright, understand the project layout and write a first test that doesn't flake."
date: 2026-10-01
tags: [playwright, typescript, getting-started]
series: "Playwright from zero"
order: 1
---

> Sample post: replace it with your own writing, or delete this file.

Playwright is a test runner and browser automation library in one package. This chapter gets you from nothing to a passing test.

## Install

```bash
npm init playwright@latest
```

The wizard creates a `playwright.config.ts`, an `e2e` folder with an example spec, and optionally a CI workflow.

## Project layout

- `playwright.config.ts`: browsers, base URL, retries and reporters
- `tests/`: your spec files
- `playwright-report/`: the HTML report from the last run

## Your first test

```ts
import { test, expect } from '@playwright/test';

test('home page has a title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

Notice there is no `sleep`. `expect(...)` is a *web-first assertion*: it retries until the condition is true or the timeout is reached.

### Running it

```bash
npx playwright test
npx playwright show-report
```

## What's next

In the next chapter we'll look at locators, which decide whether a suite stays stable or becomes a maintenance burden.
