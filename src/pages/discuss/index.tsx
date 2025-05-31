import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/store/product";
import io from "socket.io-client";
import UploadImageDiscuss from "../../components/ui/modals/uploadImageDiscuss/index";
import { useRouter } from "next/router";
import {
  DiscussionDataType,
  MessageDataType,
} from "@/types/discussionDataTypes";

const socket = io({
  path: "/api/socket",
});

export default function Discuss() {
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<DiscussionDataType | null>(null);
  const { data: session }: any = useSession();
  const { selectedProduct } = useProductStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [image, setImage] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedDiscussion?.messages]);

  const fetchDiscussion = async () => {
    if (!session?.user?.id || !selectedProduct?.id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/discuss/get?userId=${session.user.id}&productId=${selectedProduct.id}`
      );
      setSelectedDiscussion(response.data[0] || null);
    } catch (error) {
      console.error("Gagal mengambil diskusi:", error);
      setSelectedDiscussion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [session?.user?.id, selectedProduct?.id]);

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageDataType) => {
      setSelectedDiscussion((prev) => {
        if (!prev) return prev;
        if (prev.messages.some((msg) => msg.id === newMessage.id)) return prev;
        return { ...prev, messages: [...prev.messages, newMessage] };
      });
    };

    socket.on("chatMessage", handleNewMessage);

    return () => {
      // Pastikan ini void, jangan return apapun
      socket.off("chatMessage", handleNewMessage);
    };
  }, []);

  const sendMessage = async () => {
    if (
      (!message.trim() && image.length === 0) ||
      !selectedProduct ||
      !session?.user?.id
    )
      return;

    const tempId = `temp-${Date.now()}`;
    let base64Image: string | null = null;

    if (image.length > 0) {
      base64Image = await convertFileToBase64(image[0]);
    }

    const tempMessage: MessageDataType = {
      id: tempId,
      content: message || (base64Image ? "[Gambar]" : undefined),
      image: base64Image || undefined,
      user: { id: session.user.id, name: session.user.name || "Anda" },
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setSelectedDiscussion((prev) => {
      if (!prev) {
        return {
          id: `temp-discussion-${Date.now()}`,
          product: {
            ...selectedProduct,
            id: selectedProduct.id ?? `temp-product-${Date.now()}`, // fallback id string
          },
          messages: [tempMessage],
        };
      }
      return { ...prev, messages: [...prev.messages, tempMessage] };
    });

    setMessage(""); // Kosongkan input setelah mengirim
    setImage([]); // Kosongkan gambar setelah mengirim

    try {
      const response = await axios.post("/api/discuss/post/user", {
        userId: session.user.id,
        productId: selectedProduct.id,
        content: message.trim() ? message : null,
        image: base64Image ? base64Image : null,
      });

      if (!response.data) {
        console.error("Data API tidak valid:", response.data);
        return;
      }

      const newMessage = {
        ...response.data.messages[response.data.messages.length - 1],
        user: { id: session.user.id, name: session.user.name },
      };

      // ✅ Tunggu 500ms agar "Mengirim..." terlihat sebelum refresh data
      setTimeout(() => {
        fetchDiscussion(); // Refresh diskusi setelah pesan berhasil dikirim
        socket.emit("chatMessage", newMessage);
      }, 500);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);

      // ✅ Tandai sebagai failed jika gagal
      setSelectedDiscussion((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === tempId ? { ...msg, status: "failed" } : msg
          ),
        };
      });
    }
  };

  const handleUploadImage = async () => {
    if (image.length > 0) {
      setIsModalOpen(false);
      sendMessage();
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <button className="flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft />
        <div className="text-lg cursor-pointer font-semibold">Diskusi</div>
      </button>
      <main className="flex-1 flex h-screen flex-col bg-gray-200 p-2 gap-1">
        {selectedProduct ? (
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={selectedProduct.image?.[0] || ""}
                  alt="Produk"
                />
                <AvatarFallback>PD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {selectedProduct.name || "Nama Produk"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedProduct.variant || "Variant"}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <p>Loading...</p>
        )}

        <ScrollArea className="flex-1 overflow-y-auto p-2 scroll">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : selectedDiscussion?.messages?.length ? (
            selectedDiscussion.messages.map((msg) => {
              const isUserMessage = msg?.user?.id === session?.user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isUserMessage ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      isUserMessage
                        ? "bg-gray-900 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.image ? (
                      <img
                        src={msg.image}
                        alt="Gambar"
                        className="rounded-lg max-w-xs"
                      />
                    ) : (
                      msg.content
                    )}
                    {msg.status === "pending" && (
                      <p className="text-sm text-gray-400">Mengirim...</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Belum ada pesan.</p>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="flex items-center bg-transparent px-2 py-1">
          <div className="h-14 flex gap-3 rounded-full flex-1 items-center bg-white px-6 shadow-md">
            <Input
              type="text"
              placeholder="Tulis Pesan..."
              className="flex-1 border-none focus-visible:ring-0 focus:ring-0 focus:outline-none focus:stroke-none rounded-full text-gray-900 shadow-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              size={"sm"}
              variant={"ghost"}
              className="bg-transparent"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <Upload />
            </Button>
          </div>
          <Button
            className="ml-2 p-3 bg-gray-900 text-white rounded-full"
            onClick={sendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <UploadImageDiscuss
          handleUploadImage={handleUploadImage}
          image={image}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setImage={setImage}
        />
      </main>
    </div>
  );
}
