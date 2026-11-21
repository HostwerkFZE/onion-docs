import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

type Entry = { type: 'link'; isCurrent: boolean } | { type: 'group'; label: string; entries: Entry[] };

const holdsCurrent = (e: Entry): boolean =>
	e.type === 'link' ? e.isCurrent : e.entries.some(holdsCurrent);

// Each top-level sidebar group is a topic, and the header shows the topics as
// tabs. A page's sidebar is its own topic's contents, not all four — the way
// the Supabase and Intergalactic docs scope their navigation.
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const topics = route.sidebar as unknown as Entry[];
	const topic = topics.find((t) => t.type === 'group' && holdsCurrent(t));
	if (topic && topic.type === 'group') {
		route.sidebar = topic.entries as unknown as typeof route.sidebar;
		// Previous / next stay inside the topic too.
		const flat: { href: string; label: string; isCurrent: boolean }[] = [];
		const walk = (e: any) => (e.type === 'link' ? flat.push(e) : e.entries.forEach(walk));
		topic.entries.forEach(walk);
		const i = flat.findIndex((l) => l.isCurrent);
		const internal = (l?: { href: string }) => (l && l.href.startsWith('/') ? l : undefined);
		if (i >= 0) {
			route.pagination = {
				prev: internal(flat[i - 1]) as any,
				next: internal(flat[i + 1]) as any,
			};
		}
	}
});
