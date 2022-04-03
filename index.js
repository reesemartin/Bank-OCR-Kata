import OCRProcessor from './lib/processor.js'

async function handler() {
  const args = process.argv.slice(2)

  const rawFilePath = args[0]
  if (!rawFilePath) {
    console.error('No file parameter provided')
    process.exit(1)
  }

  const processedPath = await OCRProcessor(rawFilePath)

  console.log('Your processed output can be found here:')
  console.log(processedPath)
}

// just run now
handler()
