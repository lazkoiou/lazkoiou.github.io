# QA Automation Portfolio

An [Astro](https://astro.build) site with a home page, interactive Playwright project demos, a blog and a contact page.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the production build |

Requires Node 22.12 or newer.

## Where things live

- `src/config.ts`: your name, email, links and Formspree ID (placeholders for now)
- `src/pages/index.astro`: home page (about, skills, experience)
- `src/data/demos.ts`: the interactive test demos (spec, mock app, scripted steps)
- `src/components/Simulator.astro`: the "run tests" widget (code, mock browser, terminal, report)
- `src/content/blog/*.md`: blog posts
- `astro.config.mjs`: set `site` to your real URL (used by RSS and the sitemap)

## Add a project demo

Add an entry to `demos` in `src/data/demos.ts`. A demo has the spec text, a mock app (screens and elements) and the steps each test performs. Each step's `line` is the spec line it highlights.

## Write a blog post

Create `src/content/blog/my-post.md`:

```md
---
title: "My post"
description: "One-line summary"
date: 2026-10-21
tags: [playwright]
---
```

For a multi-chapter series, add `series: "Series name"` and `order: 1, 2, 3…` to each chapter. Set `draft: true` to hide a post from production builds. The three posts included are samples to replace.

## Contact form

Set `formspreeId` in `src/config.ts` to send messages through [Formspree](https://formspree.io). With it empty, the form opens the visitor's mail app instead.

## Deploy

`npm run build` outputs static files in `dist/`. Publish that folder to any static host (GitHub Pages, Netlify, GitLab Pages).
