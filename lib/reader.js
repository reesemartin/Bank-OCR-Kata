import { readFile } from "fs/promises";

export async function fetchOCRFile(filePath) {
  // Async read contents of file into memory.
  const fileContents = await readFile(filePath, {
    encoding: "utf8", // specifying an encoding returns the file contents as a string
  });

  return fileContents
}

export function splitAccounts(rawData) {
  // TODO: work out logic to make this auto detect in case the machine starts adding 2 lines between accounts for example
  const linesPerAccount = 4

  const rawLines = rawData.split("\n")

  const accounts = []
  let currentAccount = []
  rawLines.map(line => {
    currentAccount.push(line.replace("\r", ''))
    if (currentAccount.length === linesPerAccount) {
      accounts.push(currentAccount)
      currentAccount = []
    }
  })

  return accounts
}

export async function OCRReader(filePath) {
  const fileContents = await fetchOCRFile(filePath)

  const accounts = splitAccounts(fileContents)

  return accounts
}
