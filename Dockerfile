FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
ENV PNPM_CONFIG_IGNORE_SCRIPTS=false

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN apk add --no-cache libc6-compat python3 make g++

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build:docker
RUN pnpm prune --prod

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server

EXPOSE 3000

CMD ["node", "dist-server/prod-server.js"]