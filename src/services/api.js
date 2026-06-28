import { todayKey } from '@/utils/date'

// const baseUrl = 'http://localhost:3000'
const baseUrl = 'https://calorie-tracker-backend-rosy.vercel.app'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('plate_token')
  const headers = {
    ...options.headers,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let body = options.body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      body,
    });
  } catch (networkError) {
    // Network or CORS error
    throw new Error(networkError.message || 'Network error');
  }



  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.message || `API error: ${response.status}`;
    // Throw to be caught by callers
    throw new Error(errMsg);
  }

  return response.json();
}

function getNextDayKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function mapSexToGender(sex) {
  if (!sex) return 'OTHER'
  const upper = sex.toUpperCase()
  if (['MALE', 'FEMALE', 'OTHER'].includes(upper)) return upper
  return 'OTHER'
}

function mapGenderToSex(gender) {
  if (!gender) return 'other'
  return gender.toLowerCase()
}

function mapGoalToBackend(goal) {
  if (goal === 'lose') return 'LOSE_WEIGHT'
  if (goal === 'maintain') return 'MAINTAIN_WEIGHT'
  if (goal === 'gain') return 'GAIN_WEIGHT'
  return 'MAINTAIN_WEIGHT'
}

function mapGoalToFrontend(goal) {
  if (goal === 'LOSE_WEIGHT') return 'lose'
  if (goal === 'MAINTAIN_WEIGHT') return 'maintain'
  if (goal === 'GAIN_WEIGHT') return 'gain'
  return 'maintain'
}

function mapActivityToBackend(level) {
  if (level === 'sedentary') return 'SEDENTARY'
  if (level === 'light') return 'LIGHTLY_ACTIVE'
  if (level === 'moderate') return 'MODERATELY_ACTIVE'
  if (level === 'active') return 'VERY_ACTIVE'
  return 'LIGHTLY_ACTIVE'
}

function mapActivityToFrontend(level) {
  if (level === 'SEDENTARY') return 'sedentary'
  if (level === 'LIGHTLY_ACTIVE') return 'light'
  if (level === 'MODERATELY_ACTIVE') return 'moderate'
  if (level === 'VERY_ACTIVE') return 'active'
  if (level === 'EXTRA_ACTIVE') return 'active'
  return 'light'
}

function sanitizeUser(backendUser, backendTargets) {
  if (!backendUser) return null
  const calorieTarget = backendTargets?.calorieGoal ?? backendUser.dailyCalorieGoal ?? 2000
  const userGoal = mapGoalToFrontend(backendUser.goal)

  const targets = {
    calories: calorieTarget,
    waterMl: backendUser.dailyWaterGoalMl ?? 2000,
    protein: backendTargets?.proteinG ?? Math.round((calorieTarget * 0.3) / 4),
    carbs: backendTargets?.carbsG ?? Math.round((calorieTarget * 0.4) / 4),
    fat: backendTargets?.fatG ?? Math.round((calorieTarget * 0.3) / 9),
  }

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    age: backendUser.age,
    heightCm: backendUser.heightCm,
    weightKg: backendUser.currentWeightKg ?? backendUser.targetWeightKg ?? 70,
    sex: mapGenderToSex(backendUser.gender),
    goal: userGoal,
    activityLevel: mapActivityToFrontend(backendUser.activityLevel),
    createdAt: backendUser.createdAt,
    targets
  }
}

function mapBackendMealToFrontend(meal) {
  return {
    id: meal.id,
    dateKey: meal.loggedAt.slice(0, 10),
    source: meal.inputMethod,
    input: meal.description || meal.name,
    imageDataUrl: meal.imageUrl,
    name: meal.name,
    calories: meal.calories,
    protein: meal.proteinG,
    carbs: meal.carbsG,
    fat: meal.fatG,
    approximate: meal.inputMethod === 'image',
    createdAt: meal.loggedAt,
  }
}

function mapBackendWaterToFrontend(log) {
  return {
    id: log.id,
    dateKey: log.loggedAt.slice(0, 10),
    ml: log.amountMl,
    createdAt: log.loggedAt,
  }
}

// ---------------------------------------------------------------- auth --

export async function signup(payload) {
  // 1. Register base credentials
  const regRes = await apiRequest('/auth/register', {
    method: 'POST',
    body: {
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
    },
  })

  const token = regRes.data.token
  localStorage.setItem('plate_token', token)

  // 2. Perform secondary update for physical properties
  const updatePayload = {
    age: payload.age,
    gender: mapSexToGender(payload.sex),
    heightCm: payload.heightCm,
    currentWeightKg: payload.weightKg,
    targetWeightKg: payload.weightKg,
    goal: mapGoalToBackend(payload.goal),
    activityLevel: mapActivityToBackend(payload.activityLevel),
  }

  const profRes = await apiRequest('/users/profile', {
    method: 'PATCH',
    body: updatePayload,
  })

  const sanitized = sanitizeUser(profRes.data.user, profRes.data.targets)
  localStorage.setItem('plate_user', JSON.stringify(sanitized))
  return { user: sanitized }
}

export async function login({ email, password }) {
  const loginRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  const token = loginRes.data.token
  localStorage.setItem('plate_token', token)

  // Fetch complete profile with calculated targets
  const profRes = await apiRequest('/users/profile')
  const sanitized = sanitizeUser(profRes.data.user, profRes.data.targets)
  localStorage.setItem('plate_user', JSON.stringify(sanitized))
  return { user: sanitized }
}

export function logout() {
  localStorage.removeItem('plate_token')
  localStorage.removeItem('plate_user')
}

export function getSession() {
  try {
    const raw = localStorage.getItem('plate_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function updateProfile(userId, patch) {
  const body = {}
  if (patch.name !== undefined) body.name = patch.name.trim()
  if (patch.age !== undefined) body.age = patch.age
  if (patch.heightCm !== undefined) body.heightCm = patch.heightCm
  if (patch.sex !== undefined) body.gender = mapSexToGender(patch.sex)
  if (patch.goal !== undefined) body.goal = mapGoalToBackend(patch.goal)
  if (patch.activityLevel !== undefined) body.activityLevel = mapActivityToBackend(patch.activityLevel)

  const res = await apiRequest('/users/profile', {
    method: 'PATCH',
    body,
  })

  const sanitized = sanitizeUser(res.data.user, res.data.targets)
  localStorage.setItem('plate_user', JSON.stringify(sanitized))
  return { user: sanitized }
}

export async function logWeight(userId, weightKg, dateKey = todayKey()) {
  // Use midnight of the given date to avoid fixed 12:00 timestamps
  // Use actual time for loggedAt to reflect real logging time
  const loggedAt = new Date().toISOString();
  await apiRequest('/weight', {
    method: 'POST',
    body: { weightKg, loggedAt },
  });

  // Synchronize User profile weight property
  const res = await apiRequest('/users/profile', {
    method: 'PATCH',
    body: { currentWeightKg: weightKg },
  })

  const sanitized = sanitizeUser(res.data.user, res.data.targets)
  localStorage.setItem('plate_user', JSON.stringify(sanitized))

  const weightHistory = await getWeightHistory()
  return { weightHistory, user: sanitized }
}

export async function getWeightHistory() {
  const res = await apiRequest('/weight/history?limit=100')
  return res.data.logs
    .map((log) => ({
      id: log.id,
      dateKey: log.loggedAt.slice(0, 10),
      weightKg: log.weightKg,
    }))
    .sort((a, b) => (a.dateKey > b.dateKey ? 1 : -1))
}

// ---------------------------------------------------------- food entries --

export async function logFoodFromText(userId, dateKey, text) {
  // Log meals at midnight of the selected date
  // Use actual time for loggedAt to reflect real logging time
  const loggedAt = new Date().toISOString();
  const res = await apiRequest('/meals/text', {
    method: 'POST',
    body: { description: text, loggedAt },
  });
  return mapBackendMealToFrontend(res.data.meal)
}

export async function logFoodFromImage(userId, dateKey, file) {
  // Log image meals at midnight of the selected date
  // Use actual time for loggedAt to reflect real logging time
  const loggedAt = new Date().toISOString();
  const formData = new FormData();
  formData.append('image', file);
  formData.append('loggedAt', loggedAt);

  const res = await apiRequest('/meals/image', {
    method: 'POST',
    body: formData,
  })
  return mapBackendMealToFrontend(res.data.meal)
}

export async function updateFoodEntry(userId, entryId, patch) {
  const body = {}
  if (patch.name !== undefined) body.name = patch.name
  if (patch.calories !== undefined) body.calories = patch.calories
  if (patch.protein !== undefined) body.proteinG = patch.protein
  if (patch.carbs !== undefined) body.carbsG = patch.carbs
  if (patch.fat !== undefined) body.fatG = patch.fat

  const res = await apiRequest(`/meals/${entryId}`, {
    method: 'PATCH',
    body,
  })
  return mapBackendMealToFrontend(res.data)
}

export async function deleteFoodEntry(userId, entryId) {
  await apiRequest(`/meals/${entryId}`, {
    method: 'DELETE',
  })
  return { id: entryId }
}

export async function getEntries(userId, dateKey) {
  if (dateKey === todayKey()) {
    const res = await apiRequest('/meals/today')
    return res.data.meals.map(mapBackendMealToFrontend)
  }

  const nextDay = getNextDayKey(dateKey)
  const res = await apiRequest(`/meals/history?startDate=${dateKey}&endDate=${nextDay}&limit=100`)
  return res.data.meals
    .filter((m) => m.loggedAt.startsWith(dateKey))
    .map(mapBackendMealToFrontend)
}

export async function getEntriesInRange(userId, startKey, endKey) {
  const nextEnd = getNextDayKey(endKey)
  const res = await apiRequest(`/meals/history?startDate=${startKey}&endDate=${nextEnd}&limit=100`)
  return res.data.meals.map(mapBackendMealToFrontend)
}

// --------------------------------------------------------------- water --

export async function addWater(userId, dateKey, ml) {
  // Water logs should also use midnight timestamp
  // Use actual time for loggedAt to reflect real logging time
  const loggedAt = new Date().toISOString();
  const res = await apiRequest('/water', {
    method: 'POST',
    body: { amountMl: ml, loggedAt },
  });
  return mapBackendWaterToFrontend(res.data.log)
}

export async function deleteWaterEntry(userId, entryId) {
  await apiRequest(`/water/${entryId}`, {
    method: 'DELETE',
  })
  return { id: entryId }
}

export async function getWater(userId, dateKey) {
  const res = await apiRequest(`/water/today?date=${dateKey}`)
  return (res.data.logs || []).map(mapBackendWaterToFrontend)
}

// --------------------------------------------------------- day summaries --

export async function getDaySummary(userId, dateKey) {
  const [meals, water] = await Promise.all([
    getEntries(userId, dateKey),
    getWater(userId, dateKey),
  ])

  return {
    dateKey,
    entryCount: meals.length,
    calories: meals.reduce((s, e) => s + e.calories, 0),
    protein: meals.reduce((s, e) => s + e.protein, 0),
    carbs: meals.reduce((s, e) => s + e.carbs, 0),
    fat: meals.reduce((s, e) => s + e.fat, 0),
    waterMl: water.reduce((s, w) => s + w.ml, 0),
  }
}

export async function getStreak(userId) {
  const res = await apiRequest('/dashboard')
  return res.data.streak ?? 0
}

export async function getCalendar(year, month) {
  const res = await apiRequest(`/calendar?year=${year}&month=${month + 1}`)
  return res.data
}
