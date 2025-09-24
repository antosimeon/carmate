// lib/i18n.ts
export type Locale = 'it' | 'en'

export const messages: Record<Locale, Record<string, string>> = {
  it: {
    app_title: 'CarMate',
    // header / global
    lang_it: 'IT', lang_en: 'EN',
    // auth
    email: 'Email',
    password: 'Password',
    sign_in: 'Accedi',
    ask_admin: 'Non hai un account? Contatta l’amministratore.',
    // sidebar
    vehicles: 'Veicoli',
    reparations: 'Riparazioni',
    recurring_bills: 'Spese ricorrenti',
    settings: 'Impostazioni',
    logout: 'Esci',
    // dashboard KPIs
    total_vehicles: 'Veicoli totali',
    upcoming_bills: 'Prossime scadenze',
    open_reparations: 'Riparazioni aperte',
    // panels & actions
    your_garage: 'Il tuo garage',
    add_vehicle: 'Aggiungi veicolo',
    nickname: 'Soprannome',
    make: 'Marca',
    model: 'Modello',
    plate: 'Targa',
    delete: 'Elimina',
    checking_session: 'Verifica sessione…',
    // reparations
    select_vehicle: 'Seleziona veicolo',
    reparation_title: 'Titolo riparazione',
    cost_example: 'Costo (es. 120.50)',
    add: 'Aggiungi',
    // recurring bills
    bill_name: 'Nome spesa (es. Assicurazione)',
    amount_example: 'Importo (es. 50)',
    interval: 'Intervallo',
    monthly: 'Mensile',
    yearly: 'Annuale',
    next_due: 'Prossima scadenza',
    next_due_on: 'prossima scadenza',
  },
  en: {
    app_title: 'CarMate',
    // header / global
    lang_it: 'IT', lang_en: 'EN',
    // auth
    email: 'Email',
    password: 'Password',
    sign_in: 'Sign in',
    ask_admin: 'Don’t have an account? Ask the admin.',
    // sidebar
    vehicles: 'Vehicles',
    reparations: 'Reparations',
    recurring_bills: 'Recurring bills',
    settings: 'Settings',
    logout: 'Logout',
    // dashboard KPIs
    total_vehicles: 'Total vehicles',
    upcoming_bills: 'Upcoming bills',
    open_reparations: 'Open reparations',
    // panels & actions
    your_garage: 'Your garage',
    add_vehicle: 'Add vehicle',
    nickname: 'Nickname',
    make: 'Make',
    model: 'Model',
    plate: 'Plate',
    delete: 'Delete',
    checking_session: 'Checking session…',
    // reparations
    select_vehicle: 'Select vehicle',
    reparation_title: 'Reparation title',
    cost_example: 'Cost (e.g. 120.50)',
    add: 'Add',
    // recurring bills
    bill_name: 'Bill name (e.g. Insurance)',
    amount_example: 'Amount (e.g. 50)',
    interval: 'Interval',
    monthly: 'Monthly',
    yearly: 'Yearly',
    next_due: 'Next due',
    next_due_on: 'next due',
  },
}

