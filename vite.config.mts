import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import AutoImport from "unplugin-auto-import/vite"
import { resolve } from "path"

import { VitePluginNode } from "vite-plugin-node"

export default defineConfig(({ command, mode }) => {
  const fullEnv = loadEnv(mode, process.cwd(), "")

  return {
    root: "./api",
    server: {
      port: 8911,
    },

    // Handle custom paths in modules
    plugins: [
      ...VitePluginNode({
        appPath: resolve(__dirname, "main.ts"),
        adapter: "fastify",
        // This needs to match the export name in main.ts for the fastify server
        exportName: "redwoodApp",
      }),
      // Let the tsconfig control the paths for module resolving in the app
      tsconfigPaths(),
      // Redwood use a babel plugin to inject the context import, but we don't want to that in Vite
      // and so we use unplugin-auto-import to handle the contextual imports
      AutoImport({
        imports: [
          {
            // import { context } from '@redwoodjs/context',
            "@redwoodjs/context": ["context"],
          },
          {
            // import gql from "graphql-tag"
            "graphql-tag": ["gql"],
          }
        ],
        dts: false,
        viteOptimizeDeps: true,
      }),
    ],

    // Get the full .env set up
    define: {
      ...Object.keys(fullEnv).reduce((prev, key) => {
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_")
        prev[`process.env.${sanitizedKey}`] = JSON.stringify(fullEnv[key])
        return prev
      }, {}),
    },
  }
})
