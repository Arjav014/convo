import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch(error){
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // Change to await the axios post
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
      // Ensure the new message has all required properties
      const newMessage = {
        ...res.data,
        senderId: res.data.senderId || useAuthStore.getState().authUser._id
      };
      
      set({ messages: [...messages, newMessage] });
      return newMessage;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    
    socket.on("newMessage", (newMessage) => {
      if(newMessage.senderId !== selectedUser._id) return;

      const processedMessage = {
        ...newMessage,
        senderId: newMessage.senderId || useAuthStore.getState().authUser._id
      };
      
      set({ messages: [...get().messages, processedMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));