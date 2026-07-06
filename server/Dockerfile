FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY index.ts ./

EXPOSE 3111

# node-fetch v3 is ESM-only while tsconfig emits CJS, so the compiled
# `start:prod` path can't run under plain node; tsx (the upstream `start`
# script) executes the TS source directly and handles the interop.
CMD ["pnpm", "start"]
