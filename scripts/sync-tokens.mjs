// Copies the kit's generated tokens into this site. The kit
// (@hostwerkfze/alternanthera) is a private GitHub package, so the docs keep
// a copy of its one CSS file instead of depending on it; run this after a kit
// release to bring the copy up to date.
//
//   npm run sync-tokens                      # from ../onion-ui-kit
//   KIT_DIR=/path/to/onion-ui-kit npm run sync-tokens
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const kit = resolve(process.env.KIT_DIR ?? '../onion-ui-kit');
const from = resolve(kit, 'src/generated/tokens.css');
const to = resolve('src/styles/tokens.css');
if (!existsSync(from)) {
	console.error(`No tokens at ${from}. Set KIT_DIR to the onion-ui-kit checkout.`);
	process.exit(1);
}
copyFileSync(from, to);
console.log(`tokens.css <- ${from}`);
