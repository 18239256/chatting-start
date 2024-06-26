import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { RMQC } from "@/app/libs/RMQClient";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name,
      puppetCurUserId,
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const currentUserId = puppetCurUserId ? puppetCurUserId : currentUser.id;

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({  
                id: member.value 
              })),
              {
                id: currentUserId
              }
            ]
          }
        },
        include: {
          users: {
            select:{
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

       // Update all connections with new conversation
      newConversation.users.forEach((user) => {
        if (user.email) {
          RMQC.publish(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUserId, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUserId]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUserId
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: {
          select:{
            id: true,
            name: true,
            email: true,
            image: true,
            isRobot: true,
            robotOwnerId:true,
          },
        }
      }
    });

    //因为newConversation对象无法获得robot对象，所以要再次查询
    let robotUserId = '';
    let robotObj = {};
    newConversation.users.forEach((user,index,arr) => {
      if (user.isRobot) {
        robotUserId = user.id;
        robotObj = user;
        return;
      }
    })

    const robotData = await prisma.robot.findUnique({
      where: {
        userId: robotUserId,
      },
      include:{
        user:true,
      }
    });
    
    Object.assign(robotObj,{robot:robotData});  //robotObj被赋值后的作用是什么？看不懂了！

    // 如果机器人的所有者ID不是当前登录用户的ID，就是共享机器人，需要更新当前用户的sharedRobotIds
    if(robotData?.user.robotOwnerId !== currentUserId){
      const updateRobot = await prisma.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          shareRobots:{
            connect:{
              id:robotData?.id,
            }
          }
        },
      });
    }

    // Update all connections with new conversation
    newConversation.users.map((user) => {
      if (user.email) {
        RMQC.publish(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}