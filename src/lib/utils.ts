import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDatePart({
  date = new Date(),
  format,
}: {
  format: Intl.DateTimeFormatOptions
  date?: Date
}) {
  return date.toLocaleDateString('en-US', format)
}

export function formatNumber(number: number) {
  return number?.toLocaleString('en-US', {
    style: 'decimal',
  })
}

export function formatCurrency(number: number) {
  return number?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
