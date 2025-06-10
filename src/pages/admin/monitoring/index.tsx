import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ContractDataType } from "@/types/contractDataTypes";
import { ProgressDataTypes } from "@/types/progressDataTypes";
import { CheckCircle } from "lucide-react";

const Monitoring: React.FC = () => {
  const [contractData, setContractData] = useState<ContractDataType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressDataTypes[]>([]);

  const form = useForm({
    defaultValues: {
      description: "",
    },
  });

  const getContractData = async () => {
    try {
      const resp = await axios(`/api/contract/get?status=ACTIVE`);
      setContractData(resp.data);
      console.log("Progress Data: ", resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getContractData();
  }, []);

  const handleOpenDialog = async (contractId: string) => {
    try {
      const resp = await axios.get(`/api/contract/progress/get/${contractId}`);
      console.log("data progress: ", resp.data);
      setProgressData(resp.data);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/api/contract/progress/post", {
        contractId: data.item.id,
        description: data.description,
      });

      alert("Progress updated successfully!");
      form.reset();
      handleOpenDialog(data.item.id);
      getContractData(); // Refresh data setelah update
    } catch (error) {
      console.error("Error submitting progress:", error);
      alert("Failed to update progress. Please try again.");
    }
  };

  // Handle preview PDF
  const handlePreview = (filename: string) => {
    if (!filename) return;
    const fileUrl = `https://dbix-ta-deploy-wv6w.vercel.app/api/contract/pdf/get?filename=${filename}`;
    setPdfUrl(fileUrl);
  };

  const handleCompletedProgres = async (item: any) => {
    if (!item) return;

    try {
      const response = await axios.put("/api/contract/put", {
        ...item,
        contractId: item.id,
        status: "COMPLETED",
      });

      if (response.status === 200) {
        alert("✅ Kontrak berhasil ditandai sebagai COMPLETED");
        getContractData?.();
      } else {
        console.warn("⚠️ Status bukan 200:", response.status);
        alert("Gagal memperbarui status kontrak");
      }
    } catch (error) {
      console.error("❌ Gagal update status:", error);
      alert("Terjadi kesalahan saat menyelesaikan kontrak.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Monitoring Progress</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">DBI</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Monitoring Progress
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4 dark:bg-black">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 mt-4">
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950">
              {contractData.length > 0 &&
                contractData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {item.contractName}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {item.cost}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handlePreview(item.filename)}
                        className="bg-gray-400 text-black px-2 py-2 rounded-md"
                      >
                        Preview
                      </Button>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Dialog onOpenChange={() => handleOpenDialog(item.id)}>
                        <DialogTrigger asChild>
                          <Button variant={"outline"}>Update Progress</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            Update every process that has been completed to
                            inform the buyer
                          </DialogHeader>
                          <div>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit((data) =>
                                  onSubmit({ ...data, item })
                                )}
                                className="space-y-8"
                              >
                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Completed Process</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Input Completed Process"
                                          type="text"
                                          {...field}
                                          required
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                ></FormField>
                                <div className="flex justify-end gap-4">
                                  <Button variant={"ghost"}>Cancel</Button>
                                  <Button
                                    type="submit"
                                    className="bg-black text-white"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </form>
                            </Form>
                            <div className="space-y-4">
                              {progressData.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-white mt-1" />
                                  <div>
                                    <div className="text-sm text-gray-800 dark:text-gray-200">
                                      {item.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(
                                        item.createdAt
                                      ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant={"default"}
                        onClick={() => handleCompletedProgres(item)}
                      >
                        Completed
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] h-[90%] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview Contract</h2>
              <Button
                onClick={() => setPdfUrl(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </Button>
            </div>
            <iframe src={pdfUrl} className="w-full flex-grow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
