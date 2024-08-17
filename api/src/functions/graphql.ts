import { createGraphQLHandler } from '@redwoodjs/graphql-server'

const sdls = import.meta.glob(["../graphql/**/*.sdl.ts","!../graphql/**/*.test.ts"], { eager: true })
const services = import.meta.glob(["../services/**/*.ts", "!../services/**/*.test.ts"], { eager: true })
const directives = import.meta.glob(["../directives/**/*.ts", "!../directives/**/*.test.ts"], { eager: true })

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
