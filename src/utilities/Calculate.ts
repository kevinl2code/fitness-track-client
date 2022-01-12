import { ActivityLevel, Sex } from '../model/Model'

export class Calculate {
  public BMR(height: number, weight: number, age: number, sex: Sex) {
    if (sex === 'MALE') {
      return 66 + 6.23 * weight + 12.7 * height - 6.8 * age
    }

    if (sex === 'FEMALE') {
      return 655 + 4.35 * weight + 4.7 * height - 4.7 * age
    }
  }

  public TDEE(bmr: number, activityLevel: ActivityLevel) {
    const tdeeByActivityLevel = {
      SEDENTARY: bmr * 1.2,
      LIGHTLY_ACTIVE: bmr * 1.375,
      MODERATELY_ACTIVE: bmr * 1.55,
      VERY_ACTIVE: bmr * 1.725,
      EXTRA_ACTIVE: bmr * 1.9,
    }
    return tdeeByActivityLevel[activityLevel]
  }
}
