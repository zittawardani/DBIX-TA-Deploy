import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";
import { ContractDataType } from "@/types/contractDataTypes";
import { ProgressDataTypes } from "@/types/progressDataTypes";

const steps = ["Order Placed", "Process", "Completed"];

const OrderProgress: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [progressData, setProgressData] = useState<ProgressDataTypes[]>([]);
  const [contractData, setContractData] = useState<ContractDataType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [progressRes, contractRes] = await Promise.all([
          axios.get(`/api/contract/progress/get/${id}`),
          axios.get(`/api/contract/get?id=${id}`),
        ]);

        setProgressData(progressRes.data);
        setContractData(contractRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch progress or contract", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getCurrentStepIndex = () => {
    const status = contractData?.status?.toUpperCase();
    if (!status) return 0;
    if (status === "ACTIVE") return 1;
    if (status === "COMPLETED" || status === "DONE") return 2;
    return 0; // Default PENDING
  };

  const currentStep = contractData ? getCurrentStepIndex() : 0;

  return (
    <div className="p-6 space-y-6">
      <button className="flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft />
        <div className="text-lg cursor-pointer">View Progress</div>
      </button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {contractData && (
            <Card className="bg-gray-100 dark:bg-gray-900 p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">#{contractData.id}</div>
                <div className="text-sm text-gray-500">
                  {contractData.product?.name} • Order Placed at{" "}
                  {new Date(contractData.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-xl font-bold">
                {contractData.cost
                  ? `Rp ${contractData.cost.toLocaleString()}`
                  : "-"}
              </div>
            </Card>
          )}

          {/* Progress Bar */}
          <div className="flex justify-between items-center mt-8 px-4 relative">
            {steps.map((label, index) => {
              const isCompleted = index <= currentStep;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center relative z-10"
                >
                  {/* Dot */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      isCompleted
                        ? "bg-green-500 dark:bg-white border-green-500 dark:border-white"
                        : "bg-white dark:bg-gray-700 border-gray-400"
                    }`}
                  />
                  {/* Label */}
                  <div className="text-xs text-center mt-2 text-gray-700 dark:text-gray-300">
                    {label}
                  </div>

                  {/* Connecting Line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-[10px] left-1/2 w-full h-[2px] -translate-y-1/2 z-[-1]">
                      <div
                        className={`h-full ${
                          index < currentStep
                            ? "bg-green-500 dark:bg-white"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Riwayat Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-lg font-semibold mb-4">
                Completed Process
              </div>
              <div className="space-y-4">
                {progressData.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-white mt-1" />
                    <div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        {item.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderProgress;
