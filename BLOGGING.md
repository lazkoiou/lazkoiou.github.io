# Writing a blog post

A post is a Markdown file in `src/content/blog/`. The filename becomes the URL: `my-first-post.md` is served at `/blog/my-first-post`.

## 1. Create the file

Start with this frontmatter:

```md
---
title: "Why I stopped using sleep() in tests"
description: "One sentence shown on the blog list and in search results."
date: 2026-11-04
tags: [playwright, flaky-tests]
draft: true
---

Your intro paragraph.

## A section heading

Text, lists, links, images and code blocks all work.
```

## Frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown as the post heading. |
| `description` | yes | Shown on cards and in the page meta. |
| `date` | yes | `YYYY-MM-DD`. Posts are sorted by it. |
| `tags` | no | Each tag gets its own page at `/blog/tags/<tag>`. |
| `draft` | no | `true` hides the post from the site. Remove it or set `false` to publish. |
| `series` | no | Group name for a multi-chapter series, such as `"Playwright from zero"`. |
| `order` | no | Chapter number within the series (1, 2, 3…). |

## 2. Writing the body

- `##` and `###` headings automatically build the table of contents on the post page.
- Code blocks take a language, such as ` ```ts `, and get syntax highlighting in both light and dark themes.
- Images go in `public/`, for example `public/images/report.png`, and are referenced as `![Alt text](/images/report.png)`.

## 3. Chapters and series

Give every chapter the same `series` string and a different `order`. The series box, previous/next links and the `/blog/series/<slug>` page are generated for you. The `series` text must match exactly across chapters.

```md
---
title: "Playwright from zero, part 2: locators"
series: "Playwright from zero"
order: 2
---
```

## 4. Preview locally

```bash
npm run dev
```

Open http://localhost:4321/blog. Drafts don't show up, so set `draft: false` (or remove the line) when you want to see the post.

## 5. Publish

Commit and push the new file. The GitHub Actions workflow rebuilds and deploys the site.

## Notes

- The three existing posts (`playwright-from-zero-1-setup`, `playwright-from-zero-2-locators`, `test-code-is-production-code`) are samples, each marked with "Sample post" in its body. Delete or replace them with your own writing.
- Keep only posts in `src/content/blog/`. Every `.md` file there must have valid frontmatter, or the build fails. That's why this guide lives at the project root.
