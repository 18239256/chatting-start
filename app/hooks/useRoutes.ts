import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiBookOpen, HiUsers } from 'react-icons/hi2';
import {FaIdBadge, FaRobot, FaStore, FaWeixin} from 'react-icons/fa6'
import { signOut } from "next-auth/react";
import { RiCustomerServiceFill, RiLogoutBoxFill } from "react-icons/ri";

const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      active: /^\/conversations.*$/.test(pathname || "")
    },
    { 
      label: 'Robots', 
      href: '/robots', 
      icon: FaRobot, 
      active: /^\/robots.*$/.test(pathname || "")
    },
    { 
      label: 'RobotMarket', 
      href: '/robotmarket', 
      icon: FaStore, 
      active: /^\/robotmarket.*$/.test(pathname || "")
    },
    { 
      label: 'Knowledge', 
      href: '/knowledge', 
      icon: HiBookOpen, 
      active: /^\/knowledge.*$/.test(pathname || "")
    },
    { 
      label: 'Masks', 
      href: '/masks', 
      icon: RiCustomerServiceFill, 
      active: /^\/masks.*$/.test(pathname || "")
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      active: /^\/users.*$/.test(pathname || "")
    },
    { 
      label: 'Roles', 
      href: '/roles', 
      icon: FaIdBadge, 
      active: /^\/roles.*$/.test(pathname || "")
    },
    { 
      label: 'IMEntries', 
      href: '/imentries', 
      icon: FaWeixin, 
      active: /^\/imentries.*$/.test(pathname || "")
    },
    {
      label: 'Logout', 
      onClick: () => signOut(),
      href: '#',
      icon: RiLogoutBoxFill, 
    }
  ], [pathname]);

  return routes;
};

export default useRoutes;