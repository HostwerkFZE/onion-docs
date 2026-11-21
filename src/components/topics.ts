// The four topics of the site, shown as tabs in the header and in the mobile
// menu. Each one is a top-level group of the sidebar in astro.config.mjs; the
// prefix decides which tab a page belongs to.
export const topics = [
	{ label: 'Get started', href: 'getting-started/introduction/', prefix: 'getting-started/' },
	{ label: 'Guides', href: 'guides/request-lifecycle/', prefix: 'guides/' },
	{ label: 'MCP', href: 'mcp/overview/', prefix: 'mcp/' },
	{ label: 'API reference', href: 'api/overview/', prefix: 'api/' },
];

export const DASHBOARD_URL = 'https://user.onion4.ai/';

export function withBase(path: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}/${path}`;
}

export function currentTopic(pathname: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const rest = pathname.startsWith(base) ? pathname.slice(base.length + 1) : pathname.replace(/^\//, '');
	return topics.find((t) => rest.startsWith(t.prefix));
}
