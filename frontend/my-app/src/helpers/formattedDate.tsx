export const formattedDate = (dateString: string): string => {
  const date = new Date(dateString)

  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('pt-BR', { month: 'long' })
  const year = date.getFullYear()

  const shortMonthMap: { [key: string]: string } = {
    janeiro: 'Jan',
    fevereiro: 'Fev',
    março: 'Mar',
    abril: 'Abr',
    maio: 'Mai',
    junho: 'Jun',
    julho: 'Jul',
    agosto: 'Ago',
    setembro: 'Set',
    outubro: 'Out',
    novembro: 'Nov',
    dezembro: 'Dez',
  }

  const shortMonth = shortMonthMap[month.toLowerCase()]
  const capitalizedDayOfWeek =
    dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).replace('-feira', '')

  return `${capitalizedDayOfWeek} ${shortMonth} ${day} ${year}`
}
