import getConversations from "../actions/getConversations";
import getRobotTemplates from "../actions/getRobotTemplates";
import Sidebar from "../components/sidebar/Sidebar";
import RobotList from "./components/RobotList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const robotTmpls = await getRobotTemplates();
  const conversations = await getConversations();

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
      <RobotList 
        robotTmpls={robotTmpls} 
        title="Robot" 
        initialItems={conversations}
      /> 
        {children}
      </div>
    </Sidebar>
  );
}