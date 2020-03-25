const environments = {
  development: 'development',
  production: 'production',
}

const dbUrl = process.env.DATABASE_URL
const regExDbUrl = /postgres:\/\/(\w+):(\w+)@([\w-.\d]+):(\d+)\/(\w+)/
const dbUrlMatch = dbUrl ? dbUrl.match(regExDbUrl) : null
const [pgUser, pgPassword, pgHost, pgPort, pgDatabase] = dbUrlMatch
  ? [dbUrlMatch[1], dbUrlMatch[2], dbUrlMatch[3], dbUrlMatch[4], dbUrlMatch[5]]
  : [process.env.PGUSER, process.env.PGPASSWORD, process.env.PGHOST, process.env.PGPORT, process.env.PGDATABASE]

export const ENV = {
  arenaRoot: process.env.ARENA_ROOT,
  arenaDist: process.env.ARENA_DIST,
  port: process.env.PORT || '9090',
  nodeEnv: process.env.NODE_ENV || environments.development,
  debug: Boolean(process.env.DEBUG),
  tempFolder: process.env.TEMP_FOLDER || '/tmp/arena_upload',
  buildReport: process.env.BUILD_REPORT === 'true',
  // APP VERSION
  applicationVersion: process.env.APPLICATION_VERSION,
  gitCommitHash: process.env.GIT_COMMIT_HASH,
  gitBranch: process.env.GIT_BRANCH,
  // DB
  dbUrl,
  pgUser,
  pgPassword,
  pgHost,
  pgPort,
  pgDatabase,
  pgSsl: process.env.PGSSL === 'true',
  migrateOnly: process.env.MIGRATE_ONLY === 'true',
  // EMAIL
  adminEmail: process.env.ADMIN_EMAIL,
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  // ANALYSIS
  analysisOutputDir: process.env.ANALYSIS_OUTPUT_DIR,
  // SESSION
  sessionIdCookieSecret: process.env.SESSION_ID_COOKIE_SECRET,
  // SERVER
  useHttps: process.env.USE_HTTPS === 'true',
}

export const isEnvDevelopment = ENV.nodeEnv === environments.development
export const isEnvProduction = ENV.nodeEnv === environments.production
