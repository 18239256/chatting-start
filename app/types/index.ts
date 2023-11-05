import {  Conversation, Knowledge, Message, Robot, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[],
  messages: FullMessageType[]
};

export type FullRobotConversationType = Conversation & { 
  users: FullUserType[],
  messages: FullMessageType[]
};

export type FullUserType = User & {
  robot: Robot | null
};

// export type FullRobotUserType = User & {
//   robot: Robot,
//   robotTmpl: RobotTemplate
// };

export type OPENAIFastAPIParamType = {
  model: string,
  messages: any[],
  temperature: number,
  n: number,
  max_tokens: number,
  stop: [],
  stream: boolean,
  presence_penalty: number,
  frequency_penalty: number
};