interface EventDefinitions {
  "message-success": (a: string, b: number) => void;
  "hello-world": (a: boolean) => void;
}

type BotEventNames = keyof EventDefinitions;

export type BotSocketEvent = {
  [K in BotEventNames as `bot/${K}`]: EventDefinitions[K];
};
