import * as assert from 'assert'
import { splitRawDigits, recognizeDigits, isIllegible, validate } from '../lib/converter.js'

describe("splitRawDigits", function() {
  it("outputs an array", function() {
    let accounts = splitRawDigits(
      [
        [" _  _  _  _  _  _  _  _  _ "],
        ["| || || || || || || || || |"],
        ["|_||_||_||_||_||_||_||_||_|"],
        ["                           "],
      ]
    )
    assert.equal(typeof accounts, typeof [])
  });

  it("outputs an array of 9 account digits each when provided the visual representation of an account broken into 4 lines", function() {
    let accounts = splitRawDigits(
      [
        [" _  _  _  _  _  _  _  _  _ "],
        ["| || || || || || || || || |"],
        ["|_||_||_||_||_||_||_||_||_|"],
        ["                           "],
      ]
    )
    assert.equal(accounts.length, 9)
  });
});

describe("recognizeDigits", function() {
  it("outputs an number if passed an obvious visual number", function() {
    let digit = recognizeDigits(
      [
        " _ ",
        "| |",
        "|_|",
      ]
    )
    assert.equal(typeof digit, typeof 0)
  });

  it("converts visual number into actual number", function() {
    let digit = recognizeDigits(
      [
        " _ ",
        "| |",
        "|_|",
      ]
    )
    assert.equal(digit, 0)
  });

  it("returns question mark if it fails to recognize actual number", function() {
    let digit = recognizeDigits(
      [
        " _ ",
        "|  ", // missing right pipe
        "|_|",
      ]
    )
    assert.equal(digit, '?')
  });
});

describe("isIllegible", function() {
  it("returns false if passed all numbers with no question marks", function() {
    let illegible = isIllegible( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] )
    assert.equal(illegible, false)
  });

  it("returns true if there are any question marks in the passed array", function() {
    let illegible = isIllegible( [ 1, 2, 3, 4, 5, '?', 7, 8, 9 ] )
    assert.equal(illegible, true)
  });
});

describe("validate", function() {
  it("returns true if the provided array of numbers fits the (d1 + 2*d2 + 3*d3 +..+ 9*d9) mod 11 = 0 valid account checksum", function() {
    let valid = validate( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] )
    assert.equal(valid, true)
  });

  it("returns false if the provided array of numbers does not fit the (d1 + 2*d2 + 3*d3 +..+ 9*d9) mod 11 = 0 valid account checksum", function() {
    let valid = validate( [ 2, 2, 4, 3, 6, 5, 6, 8, 6 ] )
    assert.equal(valid, false)
  });
});
