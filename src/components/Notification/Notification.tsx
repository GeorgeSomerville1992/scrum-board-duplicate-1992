type NotificationProps = {
  notification: string;
};

export const Notification = ({ notification }: NotificationProps) => (
  <div className="bg-green-100 text-green-800 p-4 rounded mb-4 fixed inset-x-0 top-0">
    Idea {notification} successfully!
  </div>
);
