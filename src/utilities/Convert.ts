type HeightFormat = 'PUNCTUATED' | 'ABBREVIATED' | 'VERBOSE'

export class Convert {
  public inchesToFeetAndInches(inches: number, format: HeightFormat) {
    const feet = inches / 12
    const remainingInches = inches % 12
    const converted = {
      PUNCTUATED: `${feet}'${remainingInches}"`,
      ABBREVIATED: `${feet}ft ${remainingInches}in`,
      VERBOSE: `${feet} feet ${remainingInches} inches`,
    }
    return converted[format]
  }
}
