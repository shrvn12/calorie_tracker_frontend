// Mifflin-St Jeor BMR, a moderate default activity multiplier, and a
// goal-based calorie adjustment. These are the standard formulas used by
// most consumer calorie trackers.

const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sedentary (little exercise)', multiplier: 1.2 },
  light: { label: 'Light exercise (1-3 days/wk)', multiplier: 1.375 },
  moderate: { label: 'Moderate exercise (3-5 days/wk)', multiplier: 1.55 },
  active: { label: 'Very active (6-7 days/wk)', multiplier: 1.725 },
}

const DEFAULT_ACTIVITY = 'light'

const GOAL_ADJUSTMENT = {
  lose: -500,
  maintain: 0,
  gain: 350,
}

export function calcBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  if (sex === 'female') return base - 161
  if (sex === 'other') return base - 78
  return base + 5
}

export function calcTDEE(profile) {
  const level = ACTIVITY_LEVELS[profile.activityLevel || DEFAULT_ACTIVITY]
  return calcBMR(profile) * level.multiplier
}

export function calcDailyCalorieTarget(profile) {
  const tdee = calcTDEE(profile)
  const adjustment = GOAL_ADJUSTMENT[profile.goal] ?? 0
  return Math.max(1200, Math.round(tdee + adjustment))
}

// Rough macro split (grams) derived from the calorie target and goal.
export function calcMacroTargets(calorieTarget, goal) {
  const splits = {
    lose: { protein: 0.35, carbs: 0.35, fat: 0.3 },
    maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    gain: { protein: 0.28, carbs: 0.47, fat: 0.25 },
  }
  const split = splits[goal] || splits.maintain
  return {
    protein: Math.round((calorieTarget * split.protein) / 4),
    carbs: Math.round((calorieTarget * split.carbs) / 4),
    fat: Math.round((calorieTarget * split.fat) / 9),
  }
}

// ~35ml per kg of body weight, rounded to the nearest 50ml for a tidy number.
export function calcWaterTargetMl(weightKg) {
  const raw = weightKg * 35
  return Math.round(raw / 50) * 50
}

export { ACTIVITY_LEVELS, DEFAULT_ACTIVITY }
