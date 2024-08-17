import fastifyUrlData from "@fastify/url-data"
import fastifyServer from "fastify"
import fastifyRawBody from "fastify-raw-body"

import { requestHandler } from "@redwoodjs/api-server/dist/requestHandlers/awsLambdaFastify"
import type { GlobalContext } from "@redwoodjs/context"
import { getAsyncStoreInstance } from "@redwoodjs/context/dist/store"

import { logger } from "./api/src/lib/logger"

const functions = import.meta.glob("./api/src/functions/*.ts", { eager: true })

async function main() {
  const fastify = fastifyServer({ logger }) as any

  // Pre-requisites for running the Redwood app
  fastify.register(fastifyUrlData)
  await fastify.register(fastifyRawBody)

  // Setup the async context store, for the per-request global context
  fastify.addHook("onRequest", (_req, _reply, done) => {
    getAsyncStoreInstance().run(new Map<string, GlobalContext>(), done)
  })

  // Go through each function and create a route for it
  for (const path of Object.keys(functions)) {
    const fns = functions[path]
    const basename = path.replace(/^.*\/([^/]+)\.ts$/, "$1")
    if (!fns.handler) {
      throw new Error(`No handler found for ${basename}`)
    }

    fastify.route({
      method: ["GET", "POST"],
      url: "/" + basename,
      handler: (req, rep) => requestHandler(req, rep, fns.handler),
    })
  }

  // If in prod, then start the server
  if (import.meta.env.PROD) fastify.listen({ port: 8911 })

  // Otherwise, let the server integrate into the vite dev server via vite-plugin-node
  // in the vite.config.mts file
  return fastify
}

export const redwoodApp = main()
