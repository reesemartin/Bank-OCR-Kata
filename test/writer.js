import * as assert from 'assert'
import { formatOCRWriterFilePath } from '../lib/writer.js'

describe("formatOCRWriterFilePath", function() {
  it("outputs a filename that includes the original filename", function() {
    let output = formatOCRWriterFilePath('./test/exampleRawOCR/test.txt')
    assert.equal(output, 'processedOCR/test-output.txt')
  });
});
