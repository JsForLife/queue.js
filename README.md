# queue.js
The simplest queue with typescript and async.

## How to use
```
import { Queue } from 'queue';

let queue = new Queue();
queue.start(()=>{ awaite cb() });
```
### 使用场景：结合订阅者模式，处理并发
#### 前端阻塞请求，变并行为串行
```
import TextMessage = RongIMLib.TextMessage;
import { subscribe } from 'pubsub-js';
import { Queue } from 'queue';

const RECEIVE_MESSAGE_TEXT = 'receive_message';
let queue_map = {};

subscribe(
    RECEIVE_MESSAGE_TEXT,
    (type:string, message:Message<TextMessage>) => {
      return receive_text_message(message);
    },
 );

async receive_text_message(origin_message:Message<TextMessage>) => {
  let user_id = parseInt(origin_message.senderUserId);
  if (!queue_map[user_id]) {
    queue_map[student_id] = new Queue();
  }
  //deal_message 内部发起请求，获取用户信息，通过队列实现请求串行
  queue_map[student_id].start(async () => {await deal_message(origin_message); });
}
```

### 后端秒杀场景
#### 虽然后端的高并发场景可以通过事务来处理，但会损失掉服务端并发处理的能力，所以能否用队列实现并行组合串行的方案？
