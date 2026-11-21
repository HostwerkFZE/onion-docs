// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeBaseLinks from './src/plugins/rehype-base-links.mjs';

// Where the site is read. For now that is onion4.ai/docs/: the landing's nginx
// fetches the pages from GitHub Pages (hostwerkfze.github.io/onion-docs/) and
// serves them under /docs/, so the site is built for that address — its links,
// canonical URLs and sitemap all say onion4.ai/docs. When the docs get a host of
// their own, set the repository variables DOCS_SITE and DOCS_BASE (or change
// these defaults); the workflow passes them through.
const site = process.env.DOCS_SITE || 'https://onion4.ai';
const base = process.env.DOCS_BASE || '/docs';
// The base without its trailing slash, to put in front of "/file": "/docs" or
// "" when the site sits at the root ("//file" would name a host).
const prefix = base.replace(/\/$/, '');

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	markdown: {
		// Absolute links in the Markdown ("/guides/rate-limits/") are written as
		// if the site sat at the root; this prefixes the base, so they hold on a
		// project page and on a custom domain alike.
		rehypePlugins: [[rehypeBaseLinks, { base }]],
	},
	integrations: [
		starlight({
			title: 'Onion Docs',
			description:
				'Onion turns a URL and a plain-language instruction into structured data. Guides, the HTTP API and the MCP server.',
			logo: { src: './src/assets/onion-logo.svg', alt: 'Onion', replacesTitle: true },
			favicon: '/favicon.ico',
			head: [
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${prefix}/favicon-32.png` } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${prefix}/favicon-16.png` } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: `${prefix}/apple-touch-icon.png` } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#000000' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Martian+Mono:wght@300;400;600&family=Montserrat:wght@500;600;700&display=swap',
					},
				},
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/HostwerkFZE/onion-docs' }],
			editLink: { baseUrl: 'https://github.com/HostwerkFZE/onion-docs/edit/main/' },
			lastUpdated: true,
			customCss: ['./src/styles/tokens.css', './src/styles/onion.css'],
			routeMiddleware: './src/route-middleware.ts',
			components: {
				Header: './src/components/Header.astro',
				Sidebar: './src/components/Sidebar.astro',
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
				Hero: './src/components/Hero.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			expressiveCode: {
				themes: ['github-dark-default'],
				useStarlightUiThemeColors: true,
				styleOverrides: {
					borderRadius: '12px',
					borderColor: 'var(--border-default)',
					codeFontFamily: 'var(--ff-mono)',
					codeFontSize: '12.5px',
					codeLineHeight: '22px',
					uiFontFamily: 'var(--ff-sans)',
					codeBackground: 'var(--bg-surface-1)',
					frames: {
						editorTabBarBackground: 'var(--bg-surface-2)',
						editorActiveTabBackground: 'var(--bg-surface-1)',
						editorActiveTabIndicatorTopColor: 'var(--brand-accent)',
						terminalTitlebarBackground: 'var(--bg-surface-2)',
						terminalBackground: 'var(--bg-surface-1)',
						frameBoxShadowCssValue: 'none',
						inlineButtonBackground: 'var(--bg-surface-4)',
						inlineButtonBorder: 'var(--border-secondary)',
					},
				},
			},
			// Four topics, each with its own sidebar (see route-middleware.ts);
			// the header shows them as tabs.
			sidebar: [
				{
					label: 'Get started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Quickstart: HTTP API', slug: 'getting-started/quickstart' },
						{ label: 'Quickstart: AI agents', slug: 'getting-started/agents' },
						{ label: 'API keys', slug: 'getting-started/api-keys' },
						{ label: 'Plans and limits', slug: 'getting-started/plans' },
					],
				},
				{
					label: 'Guides',
					items: [
						{
							label: 'Concepts',
							items: [
								{ label: 'How a request works', slug: 'guides/request-lifecycle' },
								{ label: 'Writing instructions', slug: 'guides/instructions' },
								{ label: 'Results and formats', slug: 'guides/results' },
							],
						},
						{
							label: 'Building with Onion',
							items: [
								{ label: 'Crawl options', slug: 'guides/crawl-options' },
								{ label: 'Waiting for results', slug: 'guides/waiting' },
								{ label: 'Safe retries', slug: 'guides/retries' },
								{ label: 'Rate limits and concurrency', slug: 'guides/rate-limits' },
								{ label: 'Handling errors', slug: 'guides/errors' },
								{ label: 'Sending feedback', slug: 'guides/feedback' },
							],
						},
					],
				},
				{
					label: 'MCP',
					items: [
						{ label: 'Overview', slug: 'mcp/overview' },
						{ label: 'Connect a client', slug: 'mcp/clients' },
						{ label: 'Tools', slug: 'mcp/tools' },
					],
				},
				{
					label: 'API reference',
					items: [
						{ label: 'Overview', slug: 'api/overview' },
						{
							label: 'Endpoints',
							items: [
								{ label: 'Parse requests', slug: 'api/parse-requests' },
								{ label: 'Live status', slug: 'api/websocket' },
								{ label: 'Feedback', slug: 'api/feedback' },
								{ label: 'Account', slug: 'api/account' },
							],
						},
						{ label: 'Errors', slug: 'api/errors' },
						{
							label: 'OpenAPI (Swagger UI)',
							link: 'https://user.onion4.ai/api/v1/docs',
							attrs: { target: '_blank', rel: 'noopener' },
						},
					],
				},
			],
		}),
	],
});
