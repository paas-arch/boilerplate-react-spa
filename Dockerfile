# Не меняй этот файл: по нему панель собирает образ приложения.
# Сборка идёт на платформе раннера: результат — статические файлы, одинаковые для amd64 и arm64.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /src
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM caddy:2.10-alpine AS caddy

# У бинаря Caddy в официальном образе есть право на низкие порты; под с отобранными правами такой бинарь не запустит.
FROM --platform=$BUILDPLATFORM alpine:3.21 AS caddy-plain
RUN apk add --no-cache libcap
COPY --from=caddy /usr/bin/caddy /caddy
RUN setcap -r /caddy

FROM gcr.io/distroless/static:nonroot AS web
COPY --from=caddy-plain /caddy /caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /src/dist /srv
ENV XDG_CONFIG_HOME=/tmp XDG_DATA_HOME=/tmp
USER nonroot:nonroot
ENTRYPOINT ["/caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
