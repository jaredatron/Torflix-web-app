let timeStream = Rx.Observable.interval(1000)
  .timeInterval()
  .map(()=> new Date);

export { timeStream }
