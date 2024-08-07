'use client';

import { WXBasis, User, WXContacts, Robot, WXGroupIssueMessages, WXIssueMessages } from "@prisma/client";
import WXCreateModal from "./WXCreateModal";
import { useEffect, useState } from "react";
import {Image,Avatar, Tabs, Tab, Chip} from "@nextui-org/react";
import WXContactList from "./WXContactList";
import { FullRobotConversationType } from "@/app/types";
import WXMessageLogs from "./WXMessageLogs";

interface WXAdminProps {
    wxBasis: WXBasis & {wxContacts : (WXContacts  & {robot: Robot | null})[]} & {wxGroupIssueMessages: WXGroupIssueMessages []} | null;
    wxIssueMessges: (WXIssueMessages & {recipient: WXContacts})[] | null;
    curUser: User | null;
    robotConversations: FullRobotConversationType[];
}

const WXAdmin: React.FC<WXAdminProps> = ({
    wxBasis,
    wxIssueMessges,
    curUser,
    robotConversations,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactCount, setContactCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [online, setOnline] = useState(wxBasis?.online);
    const contacts = wxBasis?.wxContacts;
    const quota = {'maxPersonNumber' : wxBasis?.maxPersonNumber, 'maxRoomNumber': wxBasis?.maxRoomNumber};

    useEffect(() => {
        setContactCount(wxBasis?.wxContacts.length!);
    }, [wxBasis?.wxContacts.length]);

    useEffect(() => {
        setMessageCount(wxIssueMessges?.length!);
    }, [wxIssueMessges]);
    
    return (
        <>
            <WXCreateModal
                curUser={curUser!}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            {wxBasis == null ? (<div
                className="
          px-4 
          py-10 
          sm:px-6 
          lg:px-8 
          lg:py-6 
          h-full 
          flex 
          justify-center 
          items-center 
          bg-gray-100
        "
            >
                <div className="text-center items-center flex">
                    <h3 className="mt-2 text-2xl font-semibold text-gray-300">
                        没有开通微信机器人，
                    </h3>
                    <h3
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 text-2xl font-semibold text-sky-500 underline cursor-pointer">
                        创建一个?</h3>
                </div>
            </div>) 
            : (<div className="px-5">
                <div className="flex justify-start mb-4 pt-4 gap-4 items-center">
                    <div
                        className="
                        text-2xl 
                        font-bold 
                        text-neutral-800 
                        "
                    >
                        微信机器人配置
                    </div>
                    <Avatar isBordered 
                        color={online? "success":"default"}
                        className="w-4 h-4 text-tiny"
                        src=" " />
                </div>
                {!online && <Image 
                    src={wxBasis.qrUrl!}
                    width={300}
                    height={300}
                    alt="微信二维码"
                />}
                {online && 
                    <Tabs aria-label="Options" className="pt-4">
                        <Tab key="asign" title={
                            <div className="flex items-center space-x-2">
                                <span>AI 托管</span>
                                <Chip size="sm" variant="faded" className=" text-gray-400">{contactCount}</Chip>
                            </div>
                        }>
                            {contacts && <WXContactList contacts={contacts} robotConversations={robotConversations} quota={quota} />}
                        </Tab>
                        <Tab key="groupsending" title={
                            <div className="flex items-center space-x-2">
                                <span>群发记录</span>
                                <Chip size="sm" variant="faded" className=" text-gray-400">{messageCount}</Chip>
                            </div>
                        }>
                            {contacts && <WXMessageLogs messages={wxIssueMessges} />}                            
                        </Tab>
                    </Tabs>
                }
            </div>)}

        </>
    );
}

export default WXAdmin;