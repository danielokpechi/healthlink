import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

interface Notification {
  type: "success" | "error" | "info";
  message: string;
}

interface NotificationContextProps {
  notify: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (notif: Notification) => {
    setNotification(notif);
    setTimeout(() => setNotification(null), 4000); // auto dismiss
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return context;
};
