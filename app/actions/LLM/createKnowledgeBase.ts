import getCurrentUser from "../getCurrentUser";
import axios from "axios";
import { format } from "url";

const delKnowledgeFiles = async (
    knowledgeBaseName: string,
) => {
    try {
        let ret = {};
        const currentUser = await getCurrentUser();
        
        if (!currentUser?.id) {
            return ret;
        }

        if (knowledgeBaseName) {
            const param = {
                knowledge_base_name: knowledgeBaseName,
                vector_store_type: "faiss",
                embed_model: "m3e-base"
            };
            const apiUrl = format({
                protocol: process.env.LLM_API_PROTOCOL,
                hostname: process.env.LLM_API_HOST,
                port: process.env.LLM_API_PORT,
                pathname: "/api/knowledge_base/create_knowledge_base"
            });

            const result = await axios.post(apiUrl,param);
            if(result.status === 200 && result.data.code === 200)
                    ret = result.data;
        }
        return ret;

    } catch (error: any) {
        return [];
    }
};

export default delKnowledgeFiles;