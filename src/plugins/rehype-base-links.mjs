// Prefixes the site's base to root-relative links in Markdown, so a page can
// write [limits](/guides/rate-limits/) and have it work under /onion-docs/ on
// GitHub Pages as well as at the root of a custom domain.
export default function rehypeBaseLinks({ base = '/' } = {}) {
	const prefix = base.replace(/\/$/, '');
	return (tree) => {
		if (!prefix) return;
		const visit = (node) => {
			if (node.type === 'element' && node.tagName === 'a') {
				const href = node.properties?.href;
				if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(prefix + '/')) {
					node.properties.href = prefix + href;
				}
			}
			if (node.children) node.children.forEach(visit);
		};
		visit(tree);
	};
}
