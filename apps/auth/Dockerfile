FROM --platform=linux/amd64 node:23-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache openssl python3 make g++

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json nest-cli.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY apps/auth/prisma ./prisma/

ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary

RUN pnpm exec prisma generate

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm run build auth

FROM --platform=linux/amd64 node:23-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
	pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

COPY --from=development /usr/src/app/node_modules/@prisma/engines ./node_modules/@prisma/engines

CMD ["node", "dist/apps/auth/main"]