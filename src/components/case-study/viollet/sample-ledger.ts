export const METRICS = {
  income: 5_000_000,
  expenses: 3_295_500,
  net: 1_704_500,
  incomeChange: 2.1,
  expensesChange: 8.4
}

export const CATEGORIES = [
  { key: 'housing', amount: 1_500_000, color: '#78716c' },
  { key: 'education', amount: 450_000, color: '#6366f1' },
  { key: 'supermarkets', amount: 443_600, color: '#8b5cf6' },
  { key: 'bills', amount: 285_000, color: '#14b8a6' },
  { key: 'transportation', amount: 198_000, color: '#eab308' },
  { key: 'food', amount: 165_000, color: '#f43f5e' },
  { key: 'subscriptions', amount: 89_900, color: '#a855f7' },
  { key: 'services', amount: 80_000, color: '#0ea5e9' },
  { key: 'shopping', amount: 72_000, color: '#f97316' }
] as const

export type CategoryKey = (typeof CATEGORIES)[number]['key']

export const TRANSACTIONS = [
  {
    id: 'bravo',
    merchant: 'BRAVO LA ESPERILLA',
    category: 'supermarkets' as CategoryKey,
    account: 'Visa Premia *7392',
    amount: -259_100,
    from: 'Banreservas',
    email: 'notificaciones@banreservas.com'
  },
  {
    id: 'nacional',
    merchant: 'NACIONAL LA ESPERILLA',
    category: 'supermarkets' as CategoryKey,
    account: 'Banreservas Card *6158',
    amount: -189_500,
    from: 'Banreservas',
    email: 'notificaciones@banreservas.com'
  },
  {
    id: 'uber-eats',
    merchant: 'UBER*EATS',
    category: 'food' as CategoryKey,
    account: 'Qik Credit *4821',
    amount: -55_604,
    from: 'Qik',
    email: 'notificaciones@qik.do'
  },
  {
    id: 'qik-ride',
    merchant: 'UBER*RIDES',
    category: 'transportation' as CategoryKey,
    account: 'Qik Credit *4821',
    amount: -23_279,
    from: 'Qik',
    email: 'notificaciones@qik.do'
  },
  {
    id: 'claro',
    merchant: 'CLARO RD',
    category: 'bills' as CategoryKey,
    account: 'Qik Credit *4821',
    amount: -249_900,
    from: 'Qik',
    email: 'notificaciones@qik.do'
  },
  {
    id: 'plaza',
    merchant: 'PLAZA LAMA',
    category: 'shopping' as CategoryKey,
    account: 'Banreservas Card *6158',
    amount: -72_000,
    from: 'Banreservas',
    email: 'notificaciones@banreservas.com'
  }
]

export const BUDGETS = [
  { key: 'transportation' as const, spent: 198_000, amount: 450_000, color: '#eab308' },
  { key: 'bills' as const, spent: 285_000, amount: 350_000, color: '#14b8a6' },
  { key: 'subscriptions' as const, spent: 89_900, amount: 120_000, color: '#a855f7' },
  { key: 'shopping' as const, spent: 72_000, amount: 200_000, color: '#f97316' },
  { key: 'education' as const, spent: 450_000, amount: 150_000, color: '#6366f1' }
]

/** Dominican institutions from the Viollet catalog. `confirmed` mirrors emailConfirmed. */
export const INSTITUTIONS = [
  { id: 'banreservas', name: 'Banreservas', sender: 'notificaciones@banreservas.com', confirmed: true },
  { id: 'popular', name: 'Banco Popular', sender: 'notificaciones@popularenlinea.com', confirmed: true },
  { id: 'bhd', name: 'Banco BHD', sender: 'alertas@bhd.com.do', confirmed: true },
  { id: 'lafise', name: 'Banco Lafise', sender: 'notificaciones@lafise.com.do', confirmed: true },
  { id: 'qik', name: 'Qik Banco Digital', sender: 'notificaciones@qik.do', confirmed: true },
  { id: 'santa_cruz', name: 'Banco Santa Cruz', sender: 'notificaciones@bancosantacruz.do', confirmed: false },
  { id: 'apap', name: 'Asociación Popular', sender: 'notificaciones@apap.com.do', confirmed: false },
  { id: 'scotiabank', name: 'Scotiabank', sender: 'alertas@scotiabank.com.do', confirmed: false },
  { id: 'promerica', name: 'Banco Promerica', sender: 'notificaciones@promerica.com.do', confirmed: false },
  { id: 'caribe', name: 'Banco Caribe', sender: 'notificaciones@bancocaribe.com.do', confirmed: false },
  { id: 'banesco', name: 'Banesco', sender: 'notificaciones@banesco.com.do', confirmed: false }
] as const
