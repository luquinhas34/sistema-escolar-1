import { Route, Routes } from "react-router-dom";
import ChatInicio from "./inicio/index";
import ChatPage from "./conversa/ChatPage";

export default function ChatRouter() {
    return (
        <Routes>
            <Route path="/" element={<ChatInicio />} />
            <Route path=":id" element={<ChatPage />} />
        </Routes>
    );
}
