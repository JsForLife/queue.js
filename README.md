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

### 后端高并发场景，阻塞请求的处理
虽然后端的高并发场景可以通过事务来处理，但会损失掉服务端并发处理的能力，所以能否用队列实现并行组合串行的方案？

这时该压入栈的是每次请求的参数和响应体，例如：```{user_id, commodity_id, res}```

处理过程如下：

(1)设置最大并发数。

(2)检查剩余库存，与最大并发数对比，决定该从栈中取出多少条数据处理。若无库存，向所有购买请求响应购买失败。

(3)根据（2）取出多条数据，并行处理。

(4)处理完后重复（2）和 (3) ，直到栈清空或库存为零。
