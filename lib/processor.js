import { OCRReader } from './reader.js'
import { OCRConverter } from './converter.js'
import { OCRWriter } from './writer.js'

async function OCRProcessor(rawFilePath) {
  const rawAccounts = await OCRReader(rawFilePath)
  const accounts = OCRConverter(rawAccounts)
  const processedPath = await OCRWriter(rawFilePath, accounts)
  return processedPath
}

export default OCRProcessor