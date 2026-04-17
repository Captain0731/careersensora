import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lockfile in `C:\\Users\\<you>\\` makes Turbopack pick the wrong root; pin it to this app folder.
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	turbopack: {
		root: projectRoot,
	},
};

export default nextConfig;
