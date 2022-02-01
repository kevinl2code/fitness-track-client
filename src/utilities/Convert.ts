type HeightFormat = 'PUNCTUATED' | 'ABBREVIATED' | 'VERBOSE'

export class Convert {
  public inchesToFeetAndInches(inches: number, format: HeightFormat) {
    const feet = inches / 12
    const remainingInches = inches % 12
    const converted = {
      PUNCTUATED: `${Math.floor(feet)}'${remainingInches}"`,
      ABBREVIATED: `${Math.floor(feet)}ft ${remainingInches}in`,
      VERBOSE: `${Math.floor(feet)} feet ${remainingInches} inches`,
    }
    return converted[format]
  }
}

export const formattedActivityLevel = {
  SEDENTARY: 'Sedentary',
  LIGHTLY_ACTIVE: 'Lightly Active',
  MODERATELY_ACTIVE: 'Moderately Active',
  VERY_ACTIVE: 'Very Active',
  EXTRA_ACTIVE: 'Extra Active',
}
