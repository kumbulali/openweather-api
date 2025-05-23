FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/query-tracker/prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm prisma generate

COPY apps/query-tracker apps/query-tracker
COPY libs libs

RUN cd apps/query-tracker && pnpm install

RUN pnpm run build query-tracker

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["pnpm", "run", "start:prod", "dist/apps/query-tracker/main"]