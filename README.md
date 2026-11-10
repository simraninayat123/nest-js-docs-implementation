# nest-js-docs-implementation

A learning implementation of the NestJS docs, built with the structure and conventions of
[brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate): hexagonal
module layout (`domain` / `infrastructure/persistence` / `dto`), namespaced config with
boot-time validation, and TypeORM relational persistence behind abstract repositories.

Each module is documented below with its dependencies, required environment variables, and
runnable requests, so you can bring up one module at a time instead of the whole stack.

## Contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Infrastructure services](#infrastructure-services)
- [Running each module separately](#running-each-module-separately)
- [Database workflow](#database-workflow)
- [File driver switching](#file-driver-switching)
- [Troubleshooting](#troubleshooting)

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20+ | `--env-file` is used by the `typeorm` script |
| npm | 10+ | lockfile is `package-lock.json` |
| Docker + Compose | any recent | runs Postgres, LocalStack and MailDev |

## Quick start

```bash
npm install
cp .env.example .env
docker compose up -d
npm run migration:run
npm run seed:run
npm run start:dev
```

The API listens on `http://localhost:3000`. The port is hardcoded in
[src/main.ts](src/main.ts) — there is no `PORT` environment variable.

Available scripts:

| Script | What it does |
| --- | --- |
| `npm run start` | runs `src/main.ts` once through `ts-node` |
| `npm run start:dev` | watch mode via `ts-node-dev --respawn --transpile-only` |
| `npm run build` | compiles to `dist/` with `tsc` |
| `npm run start:prod` | runs the compiled `dist/main.js` |
| `npm run lint` / `npm run lint:fix` | ESLint over all `.ts` files |
| `npm run format` | Prettier over all `.ts` files |
| `npm run migration:run` / `migration:revert` / `migration:generate` / `migration:create` | TypeORM CLI wrappers |
| `npm run seed:run` | seeds authors and books |

## Environment variables

`.env` is gitignored; `.env.example` is the template. Copy it and edit as needed.

**Important:** every variable is validated at boot by `class-validator` through
[src/utils/validate-config.ts](src/utils/validate-config.ts). All five config namespaces are
loaded globally in [src/app.module.ts](src/app.module.ts), so a variable missing for *any*
namespace stops the whole application from starting — even if the module that consumes it is
not the one you are working on. That is the main thing to keep in mind when running a single
module: keep all required variables present, and only the behaviour changes per module.

### `app` — [src/config/app.config.ts](src/config/app.config.ts)

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `BACKEND_DOMAIN` | no | `http://localhost` | `files` — prefixed onto the stored path when `FILE_DRIVER=local`. Set it to `http://localhost:3000` so returned URLs are reachable |
| `FRONTEND_DOMAIN` | no | `http://localhost` | `mail` — base of the magic-link URL |

### `database` — [src/database/config/database.config.ts](src/database/config/database.config.ts)

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `DATABASE_TYPE` | yes | — | `postgres` |
| `DATABASE_HOST` | yes | — | TypeORM connection |
| `DATABASE_PORT` | yes | — | also sets the host port in `docker-compose.yaml` |
| `DATABASE_USERNAME` | yes | — | also creates the Postgres user |
| `DATABASE_PASSWORD` | yes | — | also sets the Postgres password |
| `DATABASE_NAME` | yes | — | also creates the database |
| `DATABASE_SYNCHRONIZE` | no | `false` | keep `false`; migrations own the schema |
| `DATABASE_LOGGING` | no | `false` | logs SQL to stdout |

### `auth` — [src/auth/config/auth.config.ts](src/auth/config/auth.config.ts)

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `AUTH_JWT_SECRET` | yes | — | signing and verifying access tokens |
| `AUTH_JWT_TOKEN_EXPIRES_IN` | yes | — | `ms` string, e.g. `15m` |
| `AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN` | yes | — | `ms` string; lifetime of the one-time token |

### `google`, `facebook`, `microsoft` — social sign-in

All optional, so the app boots without them. A provider's login endpoint returns `500` until
its variables are set.

| Variable | Config file | Used by |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | [src/auth-google/config/google.config.ts](src/auth-google/config/google.config.ts) | expected `aud` of Google ID tokens |
| `FACEBOOK_APP_ID` | [src/auth-facebook/config/facebook.config.ts](src/auth-facebook/config/facebook.config.ts) | checked against `app_id` from `debug_token` |
| `FACEBOOK_APP_SECRET` | [src/auth-facebook/config/facebook.config.ts](src/auth-facebook/config/facebook.config.ts) | app access token for `debug_token` |
| `MICROSOFT_CLIENT_ID` | [src/auth-microsoft/config/microsoft.config.ts](src/auth-microsoft/config/microsoft.config.ts) | expected `aud` of Microsoft ID tokens |

### `mail` — [src/mail/config/mail.config.ts](src/mail/config/mail.config.ts)

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `MAIL_HOST` | yes | — | SMTP host (`localhost` for MailDev) |
| `MAIL_PORT` | yes | — | SMTP port (`1025` for MailDev) |
| `MAIL_USER` | no | — | omit for MailDev; auth is skipped when empty |
| `MAIL_PASSWORD` | no | — | only used when `MAIL_USER` is set |
| `MAIL_IGNORE_TLS` | yes | — | `true` for MailDev |
| `MAIL_SECURE` | yes | — | `false` for MailDev |
| `MAIL_REQUIRE_TLS` | yes | — | `false` for MailDev |
| `MAIL_DEFAULT_EMAIL` | yes | — | `From` address |
| `MAIL_DEFAULT_NAME` | yes | — | `From` display name |

### `file` — [src/files/config/file.config.ts](src/files/config/file.config.ts)

| Variable | Required | Default | Used by |
| --- | --- | --- | --- |
| `FILE_DRIVER` | yes | — | `local` or `s3` |
| `ACCESS_KEY_ID` | only when `FILE_DRIVER=s3` | — | `test` for LocalStack |
| `SECRET_ACCESS_KEY` | only when `FILE_DRIVER=s3` | — | `test` for LocalStack |
| `AWS_DEFAULT_S3_BUCKET` | only when `FILE_DRIVER=s3` | — | bucket name; also used by the LocalStack init script |
| `AWS_S3_REGION` | only when `FILE_DRIVER=s3` | — | e.g. `us-east-1` |
| `AWS_S3_ENDPOINT` | no | — | set to `http://localhost:4566` for LocalStack; when set, path-style addressing is forced |

The max upload size is not configurable by environment: it is fixed at 5 MiB in
[src/files/config/file.config.ts](src/files/config/file.config.ts).

### Compose-only

| Variable | Required | Used by |
| --- | --- | --- |
| `LOCALSTACK_AUTH_TOKEN` | no | passed to the LocalStack container; leave empty for the community image |

## Infrastructure services

Defined in [docker-compose.yaml](docker-compose.yaml). Start all of them with
`docker compose up -d`, or just the one you need, e.g. `docker compose up -d postgres`.

| Service | Image | Ports | Needed by |
| --- | --- | --- | --- |
| `postgres` | `postgres:17-alpine` | `${DATABASE_PORT}:5432` | `authors`, `books`, `files`, `users`, `one-time-tokens`, `social-accounts`, `auth`, `auth-google`, `auth-facebook`, `auth-microsoft`, `reminders` |
| `maildev` | `maildev/maildev` | `1080:1080` (web UI), `${MAIL_PORT}:1025` (SMTP) | `mail`, `auth`, `reminders` |
| `localstack` | `localstack/localstack` | `4566:4566` | `files` only when `FILE_DRIVER=s3` |

Notes:

- Postgres data persists in the `postgres-data` volume. To wipe the database entirely:
  `docker compose down -v`.
- MailDev captures every outgoing mail — read it at <http://localhost:1080>. No mail ever
  leaves your machine.
- LocalStack runs [localstack/init-s3.sh](localstack/init-s3.sh) on startup, which creates
  the `${AWS_DEFAULT_S3_BUCKET}` bucket. Verify it with:

  ```bash
  docker compose exec localstack awslocal s3 ls
  ```

## Running each module separately

Common setup for every module below: `npm install`, a `.env` with all required variables
present, and `npm run start:dev`.

### `custom-providers` — [src/custom-providers/](src/custom-providers/)

A walkthrough of every NestJS provider form: `useValue`, `useClass`, `useFactory` with
injection, `useExisting` aliasing, and a class used as its own injection token.

| | |
| --- | --- |
| Module dependencies | none |
| Infrastructure | none |
| Migrations | none |
| Required env | none of its own |

```bash
curl http://localhost:3000/custom-providers
```

### `authors` and `books` — [src/authors/](src/authors/), [src/books/](src/books/)

The TypeORM relational layer: entities, an abstract repository with a relational
implementation, mappers between entity and domain, and a many-to-many relation between
authors and books. There are no controllers — these modules are exercised through migrations
and seeds.

| | |
| --- | --- |
| Module dependencies | their own `Relational*PersistenceModule` |
| Infrastructure | `postgres` |
| Migrations | `CreateAuthor`, `CreateBook`, `ChangeAuthorBookToManyToMany` |
| Required env | the `database` namespace |

```bash
docker compose up -d postgres
npm run migration:run
npm run seed:run
```

The seed runner ([src/database/seeds/relational/run-seed.ts](src/database/seeds/relational/run-seed.ts))
boots a standalone `SeedModule` that loads only `databaseConfig` — so it runs without the
auth, mail or file variables being set. Inspect the result:

```bash
docker compose exec postgres psql -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -c 'select * from author;' -c 'select * from book;'
```

### `mail` and `mailer` — [src/mail/](src/mail/), [src/mailer/](src/mailer/)

`MailerModule` is the transport layer: a Nodemailer transporter plus Handlebars template
rendering. `MailModule` sits on top and owns the individual messages (`welcome`,
`magicLink`). Templates live in [src/mail/mail-templates/](src/mail/mail-templates/) and are
read from disk at send time, relative to `process.cwd()` — so always run from the repo root.

| | |
| --- | --- |
| Module dependencies | `mail` → `mailer` |
| Infrastructure | `maildev` |
| Migrations | none |
| Required env | the `mail` namespace; `FRONTEND_DOMAIN` for the magic-link URL |

Neither module exposes a controller. Trigger a real send through `auth` (below), then open
<http://localhost:1080> to read it. `MailService.welcome()` is implemented but not yet called
from anywhere.

### `files` — [src/files/](src/files/)

Upload handling with two interchangeable drivers. [src/files/files.module.ts](src/files/files.module.ts)
picks the uploader module at import time from `FILE_DRIVER`, so changing the driver requires
a restart. Both drivers persist a row in the `file` table; `FilesService` only reads
(`findById`, `findByIds`) and is exported for other modules to consume.

What is stored and what is returned are deliberately different. The database holds a
driver-neutral value — `/files/<name>.png` for local, the bare object key for S3 — and
[src/files/domain/file.ts](src/files/domain/file.ts) turns it into a usable URL at
serialization time via a `class-transformer` `@Transform`: `BACKEND_DOMAIN` + path for local,
a presigned URL valid for one hour for S3. The transform returns a promise in the S3 case,
which `ResolvePromisesInterceptor` ([src/utils/serializer.interceptor.ts](src/utils/serializer.interceptor.ts))
awaits before the response is sent.

| | |
| --- | --- |
| Module dependencies | `RelationalFilePersistenceModule`, plus `FilesLocalModule` **or** `FilesS3Module` |
| Infrastructure | `postgres`; also `localstack` when `FILE_DRIVER=s3` |
| Migrations | `CreateFile` |
| Required env | the `database` and `file` namespaces; `BACKEND_DOMAIN` for the local driver |

Only `.jpg`, `.jpeg`, `.png` and `.gif` are accepted; anything else returns
`422 Unprocessable Entity` with `{"errors":{"file":"cantUploadFileType"}}`.

**Local driver** (`FILE_DRIVER=local`) — multer disk storage writing to `./files`, which is
gitignored:

```bash
curl -F file=@/path/to/image.png http://localhost:3000/files/upload
# => {"file":{"id":"...","path":"http://localhost:3000/files/<name>.png"}}

curl -O http://localhost:3000/files/<name>.png
```

The download route takes only the filename; `GET /files/:path` serves it with `root: './files'`.

**S3 driver** (`FILE_DRIVER=s3`) — `multer-s3` streaming to LocalStack. There is no download
route: open the presigned `path` from the response directly.

```bash
docker compose up -d postgres localstack
curl -F file=@/path/to/image.png http://localhost:3000/files/upload
docker compose exec localstack awslocal s3 ls "s3://$AWS_DEFAULT_S3_BUCKET"
```

### `users` — [src/users/](src/users/)

The user aggregate: domain model, entity, abstract repository and relational implementation.
Supports soft deletion via `deletedAt`, and `findById` and `findByEmail` take a `withDeleted`
option.

| | |
| --- | --- |
| Module dependencies | `RelationalUserPersistenceModule` |
| Infrastructure | `postgres` |
| Migrations | `CreateUser` |
| Required env | the `database` namespace |

No controller — `UsersService` (`create`, `findById`, `findByEmail`) is exported and consumed
by `auth`. Exercise it through the auth endpoints, then:

```bash
docker compose exec postgres psql -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -c 'select id, email, provider, "deletedAt" from "user";'
```

### `one-time-tokens` — [src/one-time-tokens/](src/one-time-tokens/)

Short-lived single-use tokens, used by the stateful magic-link flow. Only the SHA-256 hash of
a token is stored, never the token itself. The type enum has two members, `magic_link` and
`otp`; only `magic_link` is wired into a flow so far.

| | |
| --- | --- |
| Module dependencies | `RelationalOneTimeTokenPersistenceModule` |
| Infrastructure | `postgres` |
| Migrations | `CreateOneTimeToken` |
| Required env | the `database` namespace |

No controller. It is imported by `AuthModule`, not by `AppModule` directly. Watch the rows
while running the auth flow:

```bash
docker compose exec postgres psql -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -c 'select id, email, type, "expiresAt", "usedAt", attempts from one_time_token;'
```

### `auth` — [src/auth/](src/auth/)

Passwordless login. `POST /auth/magic-link` creates a one-time token, stores its hash, and
mails the raw value as a link. `POST /auth/magic-link/confirm` redeems the hash, creates the
user on first sign-in, and returns a JWT. The `jwt` Passport strategy
([src/auth/strategies/jwt.strategy.ts](src/auth/strategies/jwt.strategy.ts)) reloads the user
from the database on every request, so the token carries only an `id`.

| | |
| --- | --- |
| Module dependencies | `users`, `one-time-tokens`, `mail`, `PassportModule`, `JwtModule` |
| Infrastructure | `postgres`, `maildev` |
| Migrations | `CreateUser`, `CreateOneTimeToken` |
| Required env | the `database`, `auth` and `mail` namespaces; `FRONTEND_DOMAIN` |

Full flow:

```bash
docker compose up -d postgres maildev
npm run migration:run
npm run start:dev
```

1. Request a link — always returns `204`, whether or not the email exists, so the endpoint
   cannot be used to enumerate users:

   ```bash
   curl -i -X POST http://localhost:3000/auth/magic-link \
     -H 'Content-Type: application/json' \
     -d '{"email":"you@example.com"}'
   ```

2. Open <http://localhost:1080>, find the "Your sign-in link" mail, and copy the `hash` query
   parameter out of the link.

3. Redeem it for a token:

   ```bash
   curl -X POST http://localhost:3000/auth/magic-link/confirm \
     -H 'Content-Type: application/json' \
     -d '{"hash":"<hash-from-the-email>"}'
   # => {"token":"...","tokenExpires":...,"user":{...}}
   ```

4. Call the guarded endpoint:

   ```bash
   curl http://localhost:3000/auth/me -H 'Authorization: Bearer <token>'
   ```

Replaying step 3 with the same hash returns `422` with `{"errors":{"hash":"invalidHash"}}` —
`markAsUsed` is the single redemption point. Requesting a new link deletes the recipient's
unused tokens of the same type first, so only the newest link works.

## Database workflow

```bash
npm run migration:run      # apply pending migrations
npm run migration:revert   # roll back the most recent one
npm run seed:run           # seed authors and books
```

To create a migration from entity changes:

```bash
npm run migration:generate -- src/database/migrations/<Name>
```

For a hand-written one:

```bash
npm run migration:create -- src/database/migrations/<Name>
```

The CLI uses [src/database/data-source.ts](src/database/data-source.ts), which reads
`process.env` directly rather than going through `@nestjs/config`. The `typeorm` script loads
`.env` via `node --env-file=.env`, so the file must exist before any migration command.

Keep `DATABASE_SYNCHRONIZE=false`. Entities are discovered by glob (`**/*.entity{.ts,.js}`),
so a new entity is picked up with no registration step.

## File driver switching

```bash
# local disk
FILE_DRIVER=local

# LocalStack S3
FILE_DRIVER=s3
ACCESS_KEY_ID=test
SECRET_ACCESS_KEY=test
AWS_S3_REGION=us-east-1
AWS_DEFAULT_S3_BUCKET=nest-files
AWS_S3_ENDPOINT=http://localhost:4566
```

The driver is resolved when the module graph is built, so restart after changing it. What
changes with the driver:

| | `local` | `s3` |
| --- | --- | --- |
| Storage | `./files` on disk | S3 bucket |
| `POST /files/upload` | yes | yes |
| `GET /files/:path` | yes | no route — use the presigned URL |
| Value in the database | `/files/<name>.ext` | bare object key |
| Serialized `path` | `BACKEND_DOMAIN` + stored path | presigned URL, 1 hour |
| Extra service | none | `localstack` |

For real AWS instead of LocalStack, drop `AWS_S3_ENDPOINT` (which also turns off forced
path-style addressing) and supply real credentials.

### `social-accounts` — [src/social-accounts/](src/social-accounts/)

Links a user to their accounts at external identity providers, one row per
`(provider, providerUserId)` pair in the `user_social_account` table. The pair is unique, and a
user can have several rows, so one account can sign in with Google, Facebook and Microsoft as
well as by email. Rows are removed when their user is hard-deleted.

| | |
| --- | --- |
| Module dependencies | `RelationalSocialAccountPersistenceModule` |
| Infrastructure | `postgres` |
| Migrations | `CreateUser`, `CreateUserSocialAccount` |
| Required env | the `database` namespace |

No controller. It is imported by `AuthModule`.

```bash
docker compose exec postgres psql -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" \
  -c 'select "userId", provider, "providerUserId" from user_social_account;'
```

### `auth-google`, `auth-facebook`, `auth-microsoft` — social sign-in

Token-based, as in brocoders: the client signs in with the provider's own SDK and posts the
result. Each module verifies the token with its provider, maps the profile to
`SocialInterface`, and hands it to `AuthService.validateSocialLogin`, which returns the same
`LoginResponseDto` as the magic-link flow.

| Endpoint | Body | Verification |
| --- | --- | --- |
| `POST /auth/google/login` | `{"idToken": "..."}` | `google-auth-library` `verifyIdToken`, audience `GOOGLE_CLIENT_ID` |
| `POST /auth/facebook/login` | `{"accessToken": "..."}` | Graph `debug_token` (valid, issued to `FACEBOOK_APP_ID`), then `/me` for id, email and name |
| `POST /auth/microsoft/login` | `{"idToken": "..."}` | RS256 signature against the `common` JWKS, audience `MICROSOFT_CLIENT_ID`, and `iss` equal to `https://login.microsoftonline.com/{tid}/v2.0` |

`validateSocialLogin`:

1. A known `(provider, providerUserId)` signs in its linked user.
2. Otherwise the provider must return an email (`422 emailRequired`) that it vouches for
   (`422 emailNotVerified`).
3. A user with that email is linked and signed in; if there is none, one is created with the
   provider's name and `provider` set to the provider.
4. Soft-deleted users get `422 userDeleted`, as in the magic-link flow.

What counts as a verified email:

| Provider | Verified when |
| --- | --- |
| Google | `email_verified` is `true` |
| Facebook | an email is returned at all; Facebook only returns confirmed addresses |
| Microsoft | `xms_edov` is true; the `email` claim alone is not trusted, since a tenant admin can set it to any address |

Provider setup:

- **Google** — create an OAuth client ID in the Google Cloud console; its id is
  `GOOGLE_CLIENT_ID`. The client must request the `email` and `profile` scopes.
- **Facebook** — create an app with Facebook Login; set `FACEBOOK_APP_ID` and
  `FACEBOOK_APP_SECRET`. The client must request the `email` permission.
- **Microsoft** — register an app in Microsoft Entra with supported account types "any
  organizational directory and personal Microsoft accounts"; its application (client) id is
  `MICROSOFT_CLIENT_ID`. Under *Token configuration*, add the `email` and `xms_edov` optional
  claims to the ID token, and request the `openid`, `email` and `profile` scopes.

Try it once you have a token from the provider's SDK or playground:

```bash
curl -X POST http://localhost:3000/auth/google/login \
  -H 'Content-Type: application/json' \
  -d '{"idToken":"<google-id-token>"}'
# => {"token":"...","tokenExpires":...,"user":{...}}
```

### `reminders` — [src/reminders/](src/reminders/)

Reminder emails on a schedule the user picks, built on the dynamic API of `@nestjs/schedule`
(`SchedulerRegistry` plus `CronJob` from the `cron` package). Each reminder is a row in the
`reminder` table and a cron job named `reminder-<id>` in the registry. On every tick the job
loads the reminder and its owner, and mails the message to the owner's address with the
[reminder.hbs](src/mail/mail-templates/reminder.hbs) template.

| | |
| --- | --- |
| Module dependencies | `RelationalReminderPersistenceModule`, `mail`, `users`, `ScheduleModule` (root) |
| Infrastructure | `postgres`, `maildev` |
| Migrations | `CreateUser`, `CreateReminder` |
| Required env | the `database`, `auth` and `mail` namespaces |

All routes need a JWT, and users only see their own reminders.

| Endpoint | Body | Result |
| --- | --- | --- |
| `POST /reminders` | `{"cronTime": "0 9 * * 1-5", "message": "...", "timeZone": "Asia/Kolkata"}` | `201`, the reminder with `nextRunAt` |
| `GET /reminders` | — | the caller's reminders |
| `GET /reminders/:id` | — | one reminder, `404` if it is not the caller's |
| `DELETE /reminders/:id` | — | `204`; the cron job is removed from the registry |

- `cronTime` takes 5 fields, or 6 with seconds first. `timeZone` is an IANA name and is
  optional; without it the server's zone is used.
- A reminder may fire at most once a minute (`422 tooFrequent`), and a user may have at most
  10 (`422 tooManyReminders`). Both limits are constants in
  [reminders.service.ts](src/reminders/reminders.service.ts).
- An unparsable pattern or unknown time zone gets `422 invalidCronTime`.
- Jobs live in memory, so `onApplicationBootstrap` reschedules every stored reminder at startup.
  Every instance of the app schedules every reminder: run a single instance, or each extra
  instance sends its own copy of each email.
- A tick whose reminder or user no longer exists removes its own job.

Try it:

```bash
docker compose up -d postgres maildev
npm run migration:run
npm run start:dev

curl -X POST http://localhost:3000/reminders \
  -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' \
  -d '{"cronTime":"* * * * *","message":"Drink water"}'
```

Within a minute a "Your reminder" mail shows up at <http://localhost:1080>.

## Troubleshooting

Each config namespace throws on load, so the error message names the failing variable. Common
cases:

| Symptom | Cause |
| --- | --- |
| `AUTH_JWT_SECRET should not be empty` and similar at startup | a variable is missing from `.env`. Every namespace is validated, so a gap in one blocks the whole app — compare against `.env.example` |
| `ECONNREFUSED 127.0.0.1:5432` | Postgres is not running, or `DATABASE_PORT` does not match the published port. `docker compose up -d postgres` |
| `relation "user" does not exist` | migrations have not been applied. `npm run migration:run` |
| `ENOENT ... .env` on a migration command | the `typeorm` script requires `.env`. `cp .env.example .env` |
| `ECONNREFUSED 127.0.0.1:1025` when requesting a magic link | MailDev is not running. `docker compose up -d maildev` |
| Mail sends but the template fails to render | `MailService` resolves templates from `process.cwd()` — run from the repository root |
| `NoSuchBucket` on an S3 upload | the LocalStack init script did not run, or the bucket name does not match. `docker compose exec localstack awslocal s3 ls` |
| `422 cantUploadFileType` | only `.jpg`, `.jpeg`, `.png`, `.gif` are allowed |
| `413` / file-size rejection | uploads are capped at 5 MiB in `file.config.ts` |
| `422 invalidHash` on confirm | the hash is already used, expired, or superseded by a newer link |
| `401` on `GET /auth/me` | the token is missing, expired, or its user no longer exists |
| `500` on `POST /auth/<provider>/login` | that provider's variables are not set in `.env` |
| `422 invalidToken` on social login | the token is expired, malformed, or issued to another client id or app |
| `422 tooFrequent` on `POST /reminders` | the pattern fires more than once a minute, e.g. a 6-field pattern with `*` seconds |
| `422 emailNotVerified` on Microsoft login | the `xms_edov` optional claim is not configured in the app registration, or the account's email domain is not verified |
