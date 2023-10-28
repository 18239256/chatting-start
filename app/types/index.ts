import {  Conversation, Message, User, Robot, RobotTemplate } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[],
  messages: FullMessageType[]
};

// export type FullRobotUserType = User & {
//   robot: Robot,
//   robotTmpl: RobotTemplate
// };