'use client';

import { Role, User } from "@prisma/client";
import { Listbox, ListboxItem, Chip, ScrollShadow, Selection, Button, Select, Switch, cn } from "@nextui-org/react";
import Avatar from "@/app/components/Avatar";
import { ListboxWrapper } from "@/app/components/lists/ListboxWrapper";
import { Key, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useRoutes from "@/app/hooks/useRoutes";
import Tools from "@/app/libs/tools"

interface BodyProps {
    role: Role;
    users: User[];
}

interface IconProps {
    icon: any;
}

const Body: React.FC<BodyProps> = ({ role, users = [] }) => {
    const [roleUsers, setRoleUsers] = useState<Selection>(new Set(role.assignIds));
    const [roleChannels, setRoleChannels] = useState<Selection>(new Set(role.channels));
    const [isDefaultRole, setIsDefaultRole] = useState(Boolean(role.defaultRole));
    const arrayRoleUsers = Array.from(roleUsers);
    const arrayRoleChannels = Array.from(roleChannels);    
    const [dirtyOfUsers, setDirtyOfUsers] = useState(false);
    const [dirtyOfChannels, setDirtyOfChannels] = useState(false);
    const [dirty,setDirty] = useState(dirtyOfUsers||dirtyOfChannels);
    const [isLoading, setIsLoading] = useState(false);
    const routes = useRoutes();
    const router = useRouter();

    useEffect(() => {
        if(roleUsers === "all")
            setDirtyOfUsers(!Tools.ArrayEqual(role.assignIds, [...users.map((u)=>u.id)]));
        else
            setDirtyOfUsers(!Tools.ArrayEqual(role.assignIds, Array.from(roleUsers)));
    }, [role.assignIds, roleUsers]);

    useEffect(() => {
        if(roleChannels === "all")
            setDirtyOfChannels(!Tools.ArrayEqual(role.channels, [...routes.map((r)=>r.label)]));
        else
            setDirtyOfChannels(!Tools.ArrayEqual(role.channels, Array.from(roleChannels)));
    }, [role.channels, roleChannels]);

    useEffect(()=>{
        setDirty(dirtyOfChannels||dirtyOfUsers|| isDefaultRole !== Boolean(role.defaultRole));
    }, [dirtyOfChannels,dirtyOfUsers,isDefaultRole]);

    const topContentOfUser = useMemo(() => {
        if (!arrayRoleUsers.length) {
            return null;
        } return (
            <ScrollShadow
                // hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {arrayRoleUsers.map((value) => (
                    <Chip key={value}>{users.find((user) => `${user.id}` === `${value}`)?.name}</Chip>
                ))}
            </ScrollShadow>
        );
    }, [arrayRoleUsers.length]);

    const topContentOfChannel = useMemo(() => {
        if (!arrayRoleChannels.length) {
            return null;
        } return (
            <ScrollShadow
                // hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {arrayRoleChannels.map((value) => (
                    <Chip key={value}>{routes.find((r) => `${r.label}` === `${value}`)?.label}</Chip>
                ))}
            </ScrollShadow>
        );
    }, [arrayRoleChannels.length]);

    const saveModify = () => {
        setIsLoading(true);
        
        //更新用户变更信息
            const param = {
                roleId: role.id,
                assignIds: dirtyOfUsers? (roleUsers === "all" ? [...users.map((u) => u.id)] : arrayRoleUsers) : null,
                channels: dirtyOfChannels?(roleChannels === "all" ? [...routes.map((r) => r.label)] : arrayRoleChannels):null,
                isDefaultRole: isDefaultRole,
            }
            axios.post('/api/role/updatePrivilege', param)
                .then((callback) => {
                    if (callback?.status !== 200) {
                        toast.error('保存失败');
                    }

                    if (callback?.status == 200) {
                        toast.success('保存成功');
                        setDirtyOfUsers(false);
                    }
                })
                .catch((err) => toast.error(`${err}`))
                .finally(() => {
                    setIsLoading(false);
                    router.refresh();
                });
    };

    const CustomIcon: React.FC<IconProps> = ({icon: Icon}) => {
        return (
            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        )
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex justify-between overflow-y-auto">
                    <Switch 
                        isSelected={isDefaultRole!}
                        onValueChange={setIsDefaultRole}                        
                    >
                        新用户默认角色
                    </Switch>
                    <div>
                        <Button color="primary" disabled={!dirty || isLoading} className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200" onClick={saveModify}>
                            保存修改
                        </Button>
                    </div>
                </div>
                <div className="py-4">频道管理</div>
                <ListboxWrapper>
                    <Listbox
                        topContent={topContentOfChannel}
                        classNames={{
                            base: "max-w-[100%]",
                            list: "max-h-[600px] overflow-scroll",
                        }}
                        defaultSelectedKeys={roleChannels}
                        items={routes}
                        label="Assigned to"
                        selectionMode="multiple"
                        onSelectionChange={setRoleChannels}
                        variant="flat"
                    >
                        {(item) => (
                            <ListboxItem key={item.label} textValue={item.label||""}>
                                <div className="flex gap-2 items-center">
                                    <CustomIcon icon={item.icon} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.label}</span>
                                        <span className="text-tiny text-default-400">{item.href}</span>
                                    </div>
                                </div>
                            </ListboxItem>
                        )}
                    </Listbox>
                </ListboxWrapper>
                <div className="py-4">用户管理</div>
                <ListboxWrapper>
                    <Listbox
                        topContent={topContentOfUser}
                        classNames={{
                            base: "max-w-[100%]",
                            list: "max-h-[600px] overflow-scroll",
                        }}
                        defaultSelectedKeys={roleUsers}
                        items={users}
                        label="Assigned to"
                        selectionMode="multiple"
                        onSelectionChange={setRoleUsers}
                        variant="flat"
                    >
                        {(item) => (
                            <ListboxItem key={item.id} textValue={item.name||""}>
                                <div className="flex gap-2 items-center">
                                    <Avatar user={item} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.name}</span>
                                        <span className="text-tiny text-default-400">{item.email}</span>
                                    </div>
                                </div>
                            </ListboxItem>
                        )}
                    </Listbox>
                </ListboxWrapper>
            </div>
        </>
    )
}

export default Body;