interface User {
  id: string;
  name?: string;
}

export interface MessageDataType {
  id: string;
  content: string | undefined;
  user: User;
  image: string | undefined;
  createdAt: string;
  status?: "pending" | "sent" | "failed";
}

export interface DiscussionDataType {
  id: string;
  product: { id: string; name: string; variants: string[]; image: string[] };
  messages: MessageDataType[];
}
