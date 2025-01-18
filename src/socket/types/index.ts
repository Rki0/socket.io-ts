import { BotSocketEvent } from "./bot";
import { OperatorSocketEvent } from "./operator";
import { ReceptionSocketEvent } from "./reception";

// 그럼 소켓 이벤트가 늘어날 때마다, 여기에 일일히 추가해줘야함(extends)
// SUGGEST: 이걸 개선할 수는 없을까?
export interface ServerToClientEvents
  extends BotSocketEvent,
    OperatorSocketEvent,
    ReceptionSocketEvent {
  noArg: () => void;
  basicEmit: (a: number, b: string) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  hello: (a: string) => void;
}

export interface ClientToServerEvents {
  hi: (a: string, b: (a: string) => void) => void;
  foo: () => void;
  baz: () => void;
}
