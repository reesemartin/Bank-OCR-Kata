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
  return account.indexOf("?") !== -1
}

export function validate(account) {
  let accountTotal = account.reduce((total, x, i) => {
    return (9 - i) * x + total;
  }, 0);

  return (accountTotal % 11) === 0
}

function replaceDigitChar(str, index, replacement) {
  let strSplit = str.split('')
  strSplit[index] = replacement
  str = strSplit.join('')

  return str
}

// returns either a number or question mark
export function alternativeDigits(rawDigit) {
  let possibleAlternatives = []
  let lineIndex = 0
  while (lineIndex < 3) {
    let columnIndex = 0
    while (columnIndex < 3) {
      if (rawDigit[lineIndex][columnIndex] === ' ') {
        // see if we can change this space to an underscore or a pipe to get a digit match
        let alternativeDigit = '?'
        let alternativeRawDigit = [...rawDigit]

        alternativeRawDigit[lineIndex] = replaceDigitChar(alternativeRawDigit[lineIndex], columnIndex, '_')
        alternativeDigit = recognizeDigits(alternativeRawDigit)
        if (alternativeDigit !== '?') {
          possibleAlternatives.push(alternativeDigit)
        }

        alternativeRawDigit[lineIndex] = replaceDigitChar(alternativeRawDigit[lineIndex], columnIndex, '|')
        alternativeDigit = recognizeDigits(alternativeRawDigit)
        if (alternativeDigit !== '?') {
          possibleAlternatives.push(alternativeDigit)
        }
      }
      columnIndex++
    }
    lineIndex++
  }

  return possibleAlternatives
}

export function OCRConverter(rawAccounts) {
  const rawAccountsWithSplitDigits = rawAccounts.map(splitRawDigits)
  const accountsData = []
  rawAccountsWithSplitDigits.map(rawAccount => {
    let validAccount = false
    let illegible = false
    let ambiguous = false

    let accountDigits = rawAccount.map(recognizeDigits)
    let possibleAlternativeAccounts = []
    if ( isIllegible(accountDigits) ) {
      if (accountDigits.join('').split('?').length - 1 > 1) {
        // there are multiple unknown digits
        // TODO: add support for guessing multiple unknown digits
      }
      else {
        // loop over the digits and guess some alternative account numbers we can try
        accountDigits = accountDigits.map((x, i) => {
          let newDigit = x
          if (x === '?') {
            let possibleAlternativeDigits = alternativeDigits(rawAccount[i])
            if (possibleAlternativeDigits.length === 1) {
              // only one alternative so lets use it
              newDigit = possibleAlternativeDigits[0]
            }
            else if (possibleAlternativeDigits.length > 1) {
              ambiguous = true
              // multiple accounts for us to try so stash the list
              let possibleAlternativeAccount = [...accountDigits]
              possibleAlternativeDigits.map(alt => {
                possibleAlternativeAccount[i] = alt
                possibleAlternativeAccounts.push([...possibleAlternativeAccount])
              })
            }
          }

          return newDigit
        })
      }
    }

    // if it still has unknown digits then give up and say invalid
    illegible = isIllegible(accountDigits)
    if ( illegible ) {
      validAccount = false
    }
    else {
      validAccount = validate(accountDigits)
    }

    if (!validAccount) {
      // if not valid then check if there are possible alternatives for us to try
      let validAccounts = []
      possibleAlternativeAccounts.map(x => {
        if ( validate(x) ) {
          validAccounts.push(x)
        }
      })
      if (validAccounts.length === 1) {
        // we did find a single alternative account so lets use it
        ambiguous = false
        illegible = false
        validAccount = true
        accountDigits = validAccounts[0]
      }
    }

    accountsData.push({
      digits: accountDigits,
      illegible: illegible,
      valid: validAccount,
      ambiguous: ambiguous,
      alternatives: possibleAlternativeAccounts,
    })
  })

  return accountsData
}
