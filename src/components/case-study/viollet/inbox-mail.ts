import { BANK_COLOR, type BankId } from './banks'

// Sample bodies for the inbox scene. Bank colors are the official values in
// viollet institutions.json. Artwork paths live in ./banks.

export type InboxLang = 'es' | 'en'

export const INBOX_BANKS: Record<string, { id: BankId, color: string }> = {
  Banreservas: { id: 'banreservas', color: BANK_COLOR.banreservas },
  Qik: { id: 'qik', color: BANK_COLOR.qik },
  'Banco BHD': { id: 'bhd', color: BANK_COLOR.bhd }
}

export interface InboxRow {
  label: string
  value: string
  mono?: boolean
}

interface MailBase {
  greeting: string
  rows: InboxRow[]
  disclaimer: string
  sampleLabel: string
}

export interface BankMail extends MailBase {
  kind: 'bank'
  intro: string
}

export interface PlainMail extends MailBase {
  kind: 'plain'
  /** Header band. Not a bank brand color. */
  band: string
  paragraphs: string[]
  signoff: string
}

export type InboxMail = BankMail | PlainMail

const sampleLabel: Record<InboxLang, string> = {
  en: 'Sample data',
  es: 'Datos de ejemplo'
}

const fields: Record<InboxLang, {
  merchant: string
  when: string
  card: string
  amount: string
  currency: string
  type: string
  auth: string
  balance: string
}> = {
  en: {
    merchant: 'Merchant',
    when: 'Date and time',
    card: 'Card',
    amount: 'Amount',
    currency: 'Currency',
    type: 'Transaction type',
    auth: 'Authorization',
    balance: 'Available balance'
  },
  es: {
    merchant: 'Comercio',
    when: 'Fecha y hora',
    card: 'Tarjeta',
    amount: 'Monto',
    currency: 'Moneda',
    type: 'Tipo de transacción',
    auth: 'N.º de autorización',
    balance: 'Balance disponible'
  }
}

function bankRows (lang: InboxLang, values: {
  merchant: string
  when: string
  card: string
  amount: string
  currency: string
  type: string
  auth: string
  balance: string
}): InboxRow[] {
  const label = fields[lang]
  return [
    { label: label.merchant, value: values.merchant },
    { label: label.when, value: values.when, mono: true },
    { label: label.card, value: values.card, mono: true },
    { label: label.amount, value: values.amount, mono: true },
    { label: label.currency, value: values.currency },
    { label: label.type, value: values.type },
    { label: label.auth, value: values.auth, mono: true },
    { label: label.balance, value: values.balance, mono: true }
  ]
}

function bankDisclaimer (lang: InboxLang, bank: string): string {
  if (lang === 'es') {
    return `Aviso automático de ejemplo de ${bank}. Si no reconoces la operación, contacta al banco por sus canales oficiales. Viollet no mueve tu dinero.`
  }
  return `Sample automated notice from ${bank}. If you do not recognize the transaction, contact the bank through its official channels. Viollet does not move your money.`
}

const MAIL: Record<InboxLang, Record<string, InboxMail>> = {
  en: {
    bravo: {
      kind: 'bank',
      greeting: 'Hello Andrea Castillo,',
      intro: 'We recorded a purchase on your Visa Premia card. The notice details are in the table.',
      rows: bankRows('en', {
        merchant: 'BRAVO LA ESPERILLA',
        when: 'Oct 11, 2026, 11:18:06 AM',
        card: 'Visa Premia ••7392',
        amount: '2,591.00',
        currency: 'Dominican peso (DOP)',
        type: 'Purchase',
        auth: '847291',
        balance: '86,409.00'
      }),
      disclaimer: bankDisclaimer('en', 'Banreservas'),
      sampleLabel: sampleLabel.en
    },
    qik: {
      kind: 'bank',
      greeting: 'Hello Andrea Castillo,',
      intro: 'We recorded a charge on your Qik Credit card. The operation details are in the table.',
      rows: bankRows('en', {
        merchant: 'UBER*RIDES',
        when: 'Oct 11, 2026, 10:42:19 AM',
        card: 'Qik Credit ••4821',
        amount: '232.79',
        currency: 'Dominican peso (DOP)',
        type: 'Purchase',
        auth: '662014',
        balance: '14,267.21'
      }),
      disclaimer: bankDisclaimer('en', 'Qik'),
      sampleLabel: sampleLabel.en
    },
    bhd: {
      kind: 'bank',
      greeting: 'Hello Andrea Castillo,',
      intro: 'We recorded an ATM withdrawal on your debit card. The notice details are in the table.',
      rows: bankRows('en', {
        merchant: 'BHD ATM, Agora Mall',
        when: 'Oct 11, 2026, 9:05:33 AM',
        card: 'BHD Debit ••2286',
        amount: '5,000.00',
        currency: 'Dominican peso (DOP)',
        type: 'ATM withdrawal',
        auth: '190552',
        balance: '64,118.40'
      }),
      disclaimer: bankDisclaimer('en', 'Banco BHD'),
      sampleLabel: sampleLabel.en
    },
    friend: {
      kind: 'plain',
      band: '#3f3f46',
      greeting: 'Hi,',
      paragraphs: [
        'Want to do dinner Friday at 8 at El Conuco?',
        'I can book it if you are free. This note has no bank, no card, and no amount.'
      ],
      signoff: 'María',
      rows: [],
      disclaimer: 'Sample personal message. The sender is not in the institution catalog.',
      sampleLabel: sampleLabel.en
    },
    promo: {
      kind: 'plain',
      band: '#9a3412',
      greeting: 'Hello,',
      paragraphs: [
        'This weekend, selected electronics are 40% off.',
        'The offer is below. It is a store promotion, not a bank notice.'
      ],
      signoff: 'Centro Deals',
      rows: [
        { label: 'Item', value: '50 inch television' },
        { label: 'Was', value: 'DOP 18,990.00', mono: true },
        { label: 'Now', value: 'DOP 11,394.00', mono: true },
        { label: 'Ends', value: 'Oct 18, 2026' }
      ],
      disclaimer: 'Sample store mail. A price in an ad does not make it a bank notification.',
      sampleLabel: sampleLabel.en
    }
  },
  es: {
    bravo: {
      kind: 'bank',
      greeting: 'Hola, Andrea Castillo:',
      intro: 'Registramos un consumo en tu tarjeta Visa Premia. El detalle del aviso está en la tabla.',
      rows: bankRows('es', {
        merchant: 'BRAVO LA ESPERILLA',
        when: '11/10/2026, 11:18:06 a. m.',
        card: 'Visa Premia ••7392',
        amount: '2,591.00',
        currency: 'Peso dominicano (DOP)',
        type: 'Compra',
        auth: '847291',
        balance: '86,409.00'
      }),
      disclaimer: bankDisclaimer('es', 'Banreservas'),
      sampleLabel: sampleLabel.es
    },
    qik: {
      kind: 'bank',
      greeting: 'Hola, Andrea Castillo:',
      intro: 'Registramos un cargo en tu tarjeta Qik Credit. El detalle de la operación está en la tabla.',
      rows: bankRows('es', {
        merchant: 'UBER*RIDES',
        when: '11/10/2026, 10:42:19 a. m.',
        card: 'Qik Credit ••4821',
        amount: '232.79',
        currency: 'Peso dominicano (DOP)',
        type: 'Compra',
        auth: '662014',
        balance: '14,267.21'
      }),
      disclaimer: bankDisclaimer('es', 'Qik'),
      sampleLabel: sampleLabel.es
    },
    bhd: {
      kind: 'bank',
      greeting: 'Hola, Andrea Castillo:',
      intro: 'Registramos un retiro en cajero con tu tarjeta de débito. El detalle del aviso está en la tabla.',
      rows: bankRows('es', {
        merchant: 'Cajero BHD, Ágora Mall',
        when: '11/10/2026, 9:05:33 a. m.',
        card: 'Débito BHD ••2286',
        amount: '5,000.00',
        currency: 'Peso dominicano (DOP)',
        type: 'Retiro en cajero',
        auth: '190552',
        balance: '64,118.40'
      }),
      disclaimer: bankDisclaimer('es', 'Banco BHD'),
      sampleLabel: sampleLabel.es
    },
    friend: {
      kind: 'plain',
      band: '#3f3f46',
      greeting: 'Hola,',
      paragraphs: [
        '¿Cenamos el viernes a las 8 en El Conuco?',
        'Si puedes, reservo yo. Esta nota no trae un banco, una tarjeta ni un monto.'
      ],
      signoff: 'María',
      rows: [],
      disclaimer: 'Mensaje personal de ejemplo. El remitente no está en el catálogo de instituciones.',
      sampleLabel: sampleLabel.es
    },
    promo: {
      kind: 'plain',
      band: '#9a3412',
      greeting: 'Hola,',
      paragraphs: [
        'Este fin de semana hay 40% de descuento en electrónica seleccionada.',
        'La oferta está abajo. Es publicidad de una tienda, no un aviso de un banco.'
      ],
      signoff: 'Ofertas Centro',
      rows: [
        { label: 'Artículo', value: 'Televisor de 50 pulgadas' },
        { label: 'Antes', value: 'DOP 18,990.00', mono: true },
        { label: 'Ahora', value: 'DOP 11,394.00', mono: true },
        { label: 'Vence', value: '18/10/2026' }
      ],
      disclaimer: 'Correo comercial de ejemplo. Un precio en un anuncio no lo convierte en una notificación bancaria.',
      sampleLabel: sampleLabel.es
    }
  }
}

export function inboxMail (lang: InboxLang, id: string): InboxMail | undefined {
  return MAIL[lang][id]
}
