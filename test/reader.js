import * as assert from 'assert'
import { fetchOCRFile, splitAccounts } from '../lib/reader.js'

describe("fetchOCRFile", function() {
  it("no output if file provided is empty", async function() {
    let output = await fetchOCRFile('./test/exampleRawOCR/emptyOCR.txt')
    assert.equal(output, '')
  });

  it("outputs a string", async function() {
    let output = await fetchOCRFile('./test/exampleRawOCR/ocr1.txt')
    assert.equal(typeof output, typeof 'some text')
    assert.notEqual(output, '')
  });
});

describe("splitAccounts", function() {
  it("outputs an array", function() {
    let accounts = splitAccounts(
      " _  _  _  _  _  _  _  _  _ \n" +
      "| || || || || || || || || |\n" +
      "|_||_||_||_||_||_||_||_||_|\n" +
      "                           \n" +
      "                           \n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "                           \n"
    )
    assert.equal(typeof accounts, typeof [])
  });

  it("outputs an array of 2 arrays of 4 account strings each when provided the visual equivelent of 2 accounts", function() {
    let accounts = splitAccounts(
      " _  _  _  _  _  _  _  _  _ \n" +
      "| || || || || || || || || |\n" +
      "|_||_||_||_||_||_||_||_||_|\n" +
      "                           \n" +
      "                           \n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "  |  |  |  |  |  |  |  |  |\n" +
      "                           \n"
    )
    assert.equal(accounts.length, 2)
    assert.equal(accounts[0].length, 4)
    assert.equal(accounts[1].length, 4)
  });
});
