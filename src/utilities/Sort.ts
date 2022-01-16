interface IObjectWithDate {
  date: string
  [key: string]: any
}

export class Sort {
  public byDate(arr: any[]) {
    return arr.sort((a, b) => {
      const parsedDateA = Date.parse(a.date)
      const parsedDateB = Date.parse(b.date)
      return parsedDateA - parsedDateB
    })
  }
}
