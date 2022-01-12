import { ActivityLevel, Sex } from '../model/Model'

export class Calculate {
  //https://www.bmi-calculator.net/bmi-formula.php
  public BMI(height: number, weight: number) {
    const bmi = (weight / (height * height)) * 703
    return bmi.toFixed(2)
  }

  //https://www.bmi-calculator.net/bmr-calculator/bmr-formula.php
  public BMR(height: number, weight: number, age: number, sex: Sex) {
    if (sex === 'MALE') {
      return 66 + 6.23 * weight + 12.7 * height - 6.8 * age
    }

    if (sex === 'FEMALE') {
      return 655 + 4.35 * weight + 4.7 * height - 4.7 * age
    }
  }

  // https://www.bmi-calculator.net/bmr-calculator/harris-benedict-equation/
  public TDEE(bmr: number, activityLevel: ActivityLevel) {
    const tdeeByActivityLevel = {
      SEDENTARY: bmr * 1.2,
      LIGHTLY_ACTIVE: bmr * 1.375,
      MODERATELY_ACTIVE: bmr * 1.55,
      VERY_ACTIVE: bmr * 1.725,
      EXTRA_ACTIVE: bmr * 1.9,
    }
    return tdeeByActivityLevel[activityLevel].toFixed(2)
  }

  // https://blog.nasm.org/nutrition/how-much-protein-should-you-eat-per-day-for-weight-loss
  // Nutritional Guidelines suggest a daily intake of 1.6 and 2.2 grams of protein per kilogram,
  // or .73 and 1 grams per pound to lose weight. Athletes and heavy exercisers should
  // consume 2.2-3.4 grams of protein per kilogram (1-1.5 grams per pound) if aiming for weight loss.
  public proteinRequiredForWeightLoss(
    weight: number,
    activityLevel: ActivityLevel
  ) {
    const minimumProteinRequiredByActivityLevel = {
      SEDENTARY: weight * 0.73,
      LIGHTLY_ACTIVE: weight * 0.73,
      MODERATELY_ACTIVE: weight * 0.73,
      VERY_ACTIVE: weight * 1,
      EXTRA_ACTIVE: weight * 1,
    }

    const maximumProteinRequiredByActivityLevel = {
      SEDENTARY: weight * 1,
      LIGHTLY_ACTIVE: weight * 1,
      MODERATELY_ACTIVE: weight * 1,
      VERY_ACTIVE: weight * 1.5,
      EXTRA_ACTIVE: weight * 1.5,
    }

    return {
      minimum: minimumProteinRequiredByActivityLevel[activityLevel].toFixed(2),
      maximum: maximumProteinRequiredByActivityLevel[activityLevel].toFixed(2),
    }
  }
}
