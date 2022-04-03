import { writeFile } from "fs/promises";
import * as path from 'path'

export function formatOCRWriterFilePath(filePath) {
  const rawFileName = path.basename(filePath)
  const outputFileName = rawFileName.substring(0, rawFileName.lastIndexOf('.'))
  return 'processedOCR/' + outputFileName + '-output.txt'
}

export function formatAccountString(account) {
  let accountString = account.digits.join('')
  if (account.illegible) {
    accountString += ' ILL'
  }
  else if (!account.valid) {
    accountString += ' ERR'
  }

  return accountString
}

export async function OCRWriter(rawFilePath, accountData) {
  const outputFilePath = formatOCRWriterFilePath(rawFilePath)

  let formattedAccounts = accountData.map(formatAccountString)

  // Async write data to a file, replacing the file if it already exists.
  await writeFile(outputFilePath, formattedAccounts.join("\n"), { encoding: "utf8" })

  return outputFilePath
}
