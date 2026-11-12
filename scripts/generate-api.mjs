import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const schemaPath = path.resolve(root, process.env.OPENAPI_SCHEMA || 'api/backend-schema.yaml')
const outputPath = path.join(root, 'src/shared/api/generated/schema.ts')
const ast = await openapiTS(pathToFileURL(schemaPath))

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, astToString(ast), 'utf8')
console.log(`OpenAPI types generated from ${schemaPath}`)
