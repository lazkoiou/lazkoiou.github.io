import rss from '@astrojs/rss';
import { getPosts } from '../lib/blog';
import { SITE } from '../config';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} · Blog`,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
    })),
  });
}
