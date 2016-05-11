import Rx from 'rx'


let transfersStream = new Rx.ReplaySubject(1);
transfersStream.onNext([]);

export { transfersStream }
