FROM node:20.11.1-alpine3.19

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

CMD ["pnpm", "run", "/dev|db:studio/"]