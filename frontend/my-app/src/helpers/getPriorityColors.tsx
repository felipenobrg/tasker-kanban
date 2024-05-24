export default function getPriorityColor(priority: string): string {
  let color
  if (priority === 'Baixa') {
    color = 'green'
  } else if (priority === 'Média') {
    color = 'orange'
  } else if (priority === 'Alta') {
    color = 'red'
  } else {
    color = 'white'
  }
  return color
}
