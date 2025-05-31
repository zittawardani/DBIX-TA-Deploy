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
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ContractPDF from "@/pages/pdf";
import { pdf } from "@react-pdf/renderer";
import SignaturePad from "@/components/ui/signature-pad";
import { ContractDataType } from "@/types/contractDataTypes";

const Contract = () => {
  const [contractData, setContractData] = useState<ContractDataType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ContractDataType | null>(null);
  const [features, setFeatures] = useState<string[]>([""]);

  const [signature, setSignature] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      contractName: "",
      cost: 0,
      features: [""],
      scopeOfWork: "",
      agreement: false,
    },
  });

  // Reset form setiap kali dialog open/selectedContract berubah
  useEffect(() => {
    if (openDialog && selectedContract) {
      form.reset({
        contractName: selectedContract.contractName || "",
        cost: selectedContract.cost || 0,
        features: selectedContract.features || [""],
        scopeOfWork: selectedContract.scopeOfWork || "",
        agreement: false,
      });
      setFeatures(
        selectedContract.features && selectedContract.features.length > 0
          ? selectedContract.features
          : [""]
      );
    }
    // eslint-disable-next-line
  }, [openDialog, selectedContract]);

  const getContractData = async () => {
    try {
      const resp = await axios("/api/contract/get");
      console.log("data: ", resp.data);
      setContractData(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getContractData();
  }, []);

  const handlePreview = (filename: string) => {
    if (!filename) return;
    const fileUrl = `http://localhost:3000/api/contract/pdf/get?filename=${filename}`;
    console.log(fileUrl);
    setPdfUrl(fileUrl);
  };

  const agreement = form.watch("agreement");

  const handleAddFeature = () => {
    const newFeatures = [...features, ""];
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const handleDeleteFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const onSubmit = async (data: ContractDataType) => {
    setIsSubmitting(true);
    try {
      // 1. Update kontrak ke status AWAITING_CLIENT_SIGNATURE
      const response = await axios.put("/api/contract/put", {
        ...data,
        status: "AWAITING_CLIENT_SIGNATURE",
      });

      if (!response.data?.contract) {
        throw new Error("Data kontrak tidak tersedia.");
      }

      const updatedContract = response.data.contract;

      // 2. Reset form, refresh data, tutup dialog secepatnya
      form.reset();
      setFeatures([""]);
      getContractData();
      alert("Data berhasil dikirim! PDF kontrak akan diunggah di background.");

      // 3. Upload PDF ke server (background, tidak blocking)
      (async () => {
        try {
          const pdfBlob = await pdf(
            <ContractPDF data={updatedContract} />
          ).toBlob();
          const pdfBuffer = await pdfBlob.arrayBuffer();

          const formData = new FormData();
          formData.append("contractId", updatedContract.id);
          formData.append("userId", updatedContract.userId);
          formData.append(
            "pdfFile",
            new File([pdfBuffer], "contract.pdf", { type: "application/pdf" })
          );

          await axios.put("/api/contract/pdf/put", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // Optional: Toast sukses upload
        } catch (err) {
          console.error("Gagal upload PDF di background:", err);
        }
      })();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Terjadi kesalahan saat mengirim kontrak.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSign = async () => {
    if (!selectedContract || !signature) {
      alert("Tanda tangan harus diisi!");
      return;
    }

    try {
      // 1. Update kontrak ke status berikutnya (misal AWAITING_PAYMENT)
      const response = await axios.put("/api/contract/put", {
        ...selectedContract,
        status: "AWAITING_PAYMENT",
      });

      if (!response.data?.contract) {
        throw new Error("Data kontrak tidak tersedia.");
      }

      const updatedContract = response.data.contract;

      // 2. Tutup dialog, refresh data, notifikasi
      setSignature(null);
      setSelectedContract(null);
      setOpenDialog(false);
      getContractData();
      alert(
        "Kontrak berhasil ditandatangani! File PDF akan diunggah di background."
      );

      // 3. Upload PDF di background (tidak blocking UI)
      (async () => {
        try {
          const data = {
            fullName: updatedContract.fullName,
            address: updatedContract.address,
            contractName: updatedContract.contractName,
            cost: updatedContract.cost,
            startDate: updatedContract.startDate,
            endDate: updatedContract.endDate,
            descriptionContract: updatedContract.descriptionContract,
            features: updatedContract.features,
            scopeOfWork: updatedContract.scopeOfWork,
            signature: updatedContract.signature,
            adminSignature: signature,
          };
          const blob = await pdf(<ContractPDF data={data} />).toBlob();
          const pdfBuffer = await blob.arrayBuffer();

          const formData = new FormData();
          formData.append("contractId", updatedContract.id);
          formData.append("userId", updatedContract.userId);
          formData.append(
            "pdfFile",
            new File([pdfBuffer], "contract.pdf", { type: "application/pdf" })
          );

          await axios.put("/api/contract/pdf/put", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // Optional: toast sukses upload
        } catch (err) {
          console.error("Gagal upload PDF di background:", err);
        }
      })();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Terjadi kesalahan saat menandatangani kontrak.");
    }
  };

  const handleRejectContract = async (id: string) => {
    try {
      const confirmDelete = confirm(
        "Apakah kamu yakin ingin menolak kontrak ini?"
      );
      if (!confirmDelete) return;

      await axios.delete(`/api/contract/delete/${id}`);
      alert("Kontrak berhasil ditolak");
      getContractData();
    } catch (e) {
      console.error("❌ Gagal menolak kontrak:", e);
      alert("Terjadi kesalahan saat menolak kontrak");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Contract</h1>
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
                Contract
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="bg-white shadow rounded-lg p-4 dark:bg-black">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200 mt-4">
            <TableCaption>A list of your recent contracts.</TableCaption>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead>Id Contract</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Id User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Action</TableHead>
                {/* <TableHead>Created At</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-950">
              {contractData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product?.name || "Unknown"}</TableCell>
                  <TableCell>{item.userId}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Processing"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>Info Data Client</DialogHeader>
                        {/* Add client info here */}
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span>Full Name</span>
                          <span>{item.fullName}</span>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span>Address</span>
                          <span>{item.address}</span>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span>Start Date</span>
                          <span>{item.startDate}</span>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span>End Date</span>
                          <span>{item.endDate}</span>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <span>Description Contract</span>
                          <span>{item.descriptionContract}</span>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    {item.status === "REVISION_REQUESTED" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>View Feedback</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>Feedback</DialogHeader>
                          {/* Ambil feedback paling baru */}
                          {item.feedback && item.feedback.length > 0 ? (
                            <>
                              <div className="whitespace-pre-wrap mb-2">
                                {item.feedback[0].content}
                              </div>
                              <div className="mb-2 text-gray-700">
                                <strong>Tanggal:</strong>{" "}
                                {new Date(
                                  item.feedback[0].createdAt
                                ).toLocaleString()}
                              </div>
                            </>
                          ) : (
                            <div>Tidak ada feedback untuk kontrak ini.</div>
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : item.status !== "PENDING_APPROVAL" ? (
                      <Button
                        onClick={() => handlePreview(item.filename)}
                        className="bg-gray-400 text-black px-2 py-2 rounded-md"
                      >
                        Preview
                      </Button>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-4">
                      {(item.status === "PENDING_APPROVAL" ||
                        item.status === "REVISION_REQUESTED") && (
                        <Dialog
                          open={
                            !!(
                              openDialog &&
                              selectedContract &&
                              selectedContract.id === item.id
                            )
                          }
                          onOpenChange={(open) => {
                            setOpenDialog(open);
                            if (open) {
                              setSelectedContract(item);
                            } else {
                              setSelectedContract(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              {item.status === "PENDING_APPROVAL"
                                ? "Fill Data"
                                : "Revisi Data"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              {item.status === "PENDING_APPROVAL"
                                ? "Fill Data"
                                : "Revisi Data Kontrak"}
                            </DialogHeader>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit((data) =>
                                  onSubmit({ ...item, ...data })
                                )}
                                className="space-y-8"
                              >
                                {/* Contract Name */}
                                <FormField
                                  control={form.control}
                                  name="contractName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Contract Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          placeholder="Contract Name"
                                          {...field}
                                          required
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                {/* Cost */}
                                <FormField
                                  control={form.control}
                                  name="cost"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cost</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="Cost"
                                          {...field}
                                          required
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                {/* Features */}
                                <div>
                                  <FormLabel>Features</FormLabel>
                                  <div className="space-y-2">
                                    {features.map((feature, index) => (
                                      <div
                                        key={index}
                                        className="flex gap-2 items-center"
                                      >
                                        <Input
                                          placeholder={`Feature ${index + 1}`}
                                          type="text"
                                          value={feature}
                                          onChange={(e) =>
                                            handleFeatureChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          required
                                        />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() =>
                                            handleDeleteFeature(index)
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                  <Button
                                    type="button"
                                    className="mt-2 bg-gray-100 text-black"
                                    onClick={handleAddFeature}
                                  >
                                    + Tambah Feature
                                  </Button>
                                </div>

                                {/* Scope Of Work */}
                                <FormField
                                  control={form.control}
                                  name="scopeOfWork"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Scope Of Work</FormLabel>
                                      <FormControl>
                                        <textarea
                                          className="w-full border border-gray-300 p-2 rounded"
                                          placeholder="Scope Of Work"
                                          rows={4}
                                          {...field}
                                          required
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                {/* Agreement Checkbox */}
                                <div className="flex items-center gap-2 mt-4">
                                  <FormField
                                    control={form.control}
                                    name="agreement"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            required
                                          />
                                        </FormControl>
                                        <span>Setuju</span>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="mt-4 w-full bg-black text-white"
                                  disabled={!agreement || isSubmitting}
                                >
                                  {isSubmitting
                                    ? item.status === "PENDING_APPROVAL"
                                      ? "Creating..."
                                      : "Updating..."
                                    : item.status === "PENDING_APPROVAL"
                                    ? "Create Contract"
                                    : "Update Contract"}
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      )}

                      {item.status == "AWAITING_ADMIN_SIGNATURE" && (
                        <Dialog
                          open={
                            !!(
                              openDialog &&
                              selectedContract &&
                              selectedContract.id === item.id
                            )
                          }
                          onOpenChange={(open) => {
                            setOpenDialog(open);
                            if (open) {
                              setSelectedContract(item);
                            } else {
                              setSelectedContract(null);
                            }
                          }}
                        >
                          <DialogTrigger>
                            <Button>Sign</Button>
                          </DialogTrigger>
                          <DialogContent className="w-fit max-w-full">
                            <SignaturePad onSave={setSignature} />
                            <Button onClick={handleSign}>
                              Confirm and Accept Contract
                            </Button>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button
                        className="bg-gray-50 text-black px-2 py-2 rounded-md w-fit"
                        onClick={() => handleRejectContract(item.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                  {/* <TableCell>{item.createdAt}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Modal PDF Preview */}
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
    </div>
  );
};

export default Contract;
