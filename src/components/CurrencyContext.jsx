import { createContext, useContext, useState } from 'react'

export const CURRENCY = {
  CNY: 'cny',
  USD: 'usd',
}

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(CURRENCY.CNY)

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === CURRENCY.CNY ? CURRENCY.USD : CURRENCY.CNY))
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
