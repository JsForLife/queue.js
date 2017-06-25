interface QueueMap {
  [student_id:number]:Queue;
}

export let queue_map:QueueMap = {};

const BUSY = 'queue/busy';
const FREE = 'queue/free';

export class Queue {
  queue:Function[];
  status:string;
  constructor() {
    this.queue = [];
    this.status = FREE;
  }

  start(fn:Function) {
    this.queue.push(fn);
    if (this.status === FREE) {
      this.status = BUSY;
      this.run();
      return;
    }
  }

  async run() {
    try {
      const fc = this.queue.shift() as Function;
      await fc();
      this.next();
    }catch (err) {
      console.warn(err);
      this.next();
    }
  }

  next() {
    if (this.queue.length) {
      this.run();
      return;
    }
    this.status = FREE;
  }
}
