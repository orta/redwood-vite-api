# README

Using vite to run the RedwoodJS API with hot-reloading, and building to a single file for server deployment.

This is not meant to be a tutorial, but a reference for core team members to understand the setup. If you choose to do this, you are truly on your own, and there are likely RedwoodJS features that will not work as expected.

1. Add a `main.ts` file to the directory, this is the new server entry point
    1. This file is responsible for starting the fastify server and importing the functions
    2. It has a single export of `redwoodApp` which is the fastify server, which is used by vite-plugin-node

2. Add a `vite.config.mts` file to the directory, this is the new vite configuration. It replicates a lot of the babel plugins that RedwoodJS uses, and knows to look at `redwoodApp` for the server from `main.ts`.

3. `functions/graphql.ts` switches to use the vite glob import syntax

---

- Run dev server: `vite`
- Create deployable server: `vite build` (creates `api/dist/main.mjs`)