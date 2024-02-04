import getUserById from "@/app/actions/getUserById";
import Header from "./components/Header";
import EmptyState from "../components/EmptyState";
import Body from "./components/Body";

interface IParams {
  userId: string;
}

const UserId = async ({ params }: { params: IParams }) => {
    const user = await getUserById(params.userId);
    
    if (!user) {
      return (
        <div className="lg:pl-80 h-full">
          <div className="h-full flex flex-col">
            <EmptyState />
          </div>
        </div>
      )
  }
    return ( 
    <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
            <Header user={user}/>
            <Body user={user} />
      </div>
    </div>
  );
}

export default UserId;