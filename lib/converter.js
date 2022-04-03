import { RAW_NUMBER_MAP } from './rawMap.js'

export function splitRawDigits(rawAccount) {
  const rawAccountWithSplitDigits = []

  // TODO: make the digitIndex dynamic based on when we reach the end of the line and find no more characters but for now we trust that accounts are 9 digits long
  let digitIndex = 0
  while (digitIndex < 9) {
    // for now we are assuming the first 3 lines are digits and the 4th is blank space so we ignore
    let thisDigit = []
    for (let thisDigitLine = 0; thisDigitLine < 3; thisDigitLine++) {
      let rawDigitLine = rawAccount[thisDigitLine].slice(digitIndex * 3, (digitIndex + 1) * 3)
      thisDigit.push(rawDigitLine)
    }
    rawAccountWithSplitDigits.push(thisDigit)
    digitIndex++
  }

  return rawAccountWithSplitDigits
}

// returns either a number or question mark
export function recognizeDigits(digit) {
  let matchedNumber = '?'
  let matches = []
  let actualNumber = 0
  while (!(matches[0] && matches[1] && matches[2]) && actualNumber < 10) {
    matches = [
      false,
      false,
      false,
    ]
    RAW_NUMBER_MAP[actualNumber].map((rawLine, rawIndex) => {
      if (rawLine === digit[rawIndex]) {
        matches[rawIndex] = true
      }
    })
    if (matches[0] && matches[1] && matches[2]) {
      matchedNumber = actualNumber
    }

    actualNumber++
  }

  return matchedNumber
}

export function isIllegible(account) {
  return account.indexOf("?") !== -1;
}

export function validate(account) {
  let accountTotal = account.reduce((total, x, i) => {
    return (9 - i) * x + total;
  }, 0);

  return (accountTotal % 11) === 0;
}

export function OCRConverter(rawAccounts) {
  const rawAccountsWithSplitDigits = rawAccounts.map(splitRawDigits)
  const accountsData = []
  rawAccountsWithSplitDigits.map(rawAccount => {
    let validAccount = false
    let illegible = false

    const accountDigits = rawAccount.map(recognizeDigits)
    if ( isIllegible(accountDigits) ) {
      // TODO: Add logic to guess unknown digits
    }

    // if it still has unknown digits then give up and say invalid
    illegible = isIllegible(accountDigits)
    if ( illegible ) {
      validAccount = false
    }
    else {
      validAccount = validate(accountDigits)
    }

    accountsData.push({
      digits: accountDigits,
      illegible: illegible,
      valid: validAccount,
    })
  })

  return accountsData
}
