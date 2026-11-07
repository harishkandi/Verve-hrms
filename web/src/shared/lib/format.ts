const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** 4250 → "₹4,250" */
export function formatINR(amount: number): string {
  return inr.format(amount)
}

/** 348 → "5h 48m" */
export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
