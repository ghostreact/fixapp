"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";

export default function ReportForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ฟังก์ชันสำหรับค้นหารายงานการซ่อม
    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        const isMachineSearch = data.machine_SN || data.machine_Advice;
        const isDateSearch = data.startDate && data.endDate;

        if (isMachineSearch && isDateSearch) {
            setError(
                "กรุณาเลือกการค้นหาอย่างใดอย่างหนึ่งเท่านั้น (หมายเลขเครื่องหรือช่วงวันที่)"
            );
            setLoading(false);
            return;
        }

        if (!isMachineSearch && !isDateSearch) {
            setError("กรุณากรอกข้อมูลสำหรับค้นหาอย่างน้อยหนึ่งเงื่อนไข");
            setLoading(false);
            return;
        }

        try {
            let query = "";
            if (data.machine_SN) {
                query += `machine_SN=${data.machine_SN}&`;
            }
            if (data.machine_Advice) {
                query += `machine_Advice=${data.machine_Advice}&`;
            }
            if (data.startDate && data.endDate) {
                query += `startDate=${data.startDate}&endDate=${data.endDate}`;
            }

            const response = await fetch(`/api/search?${query}`);
            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }
            const result = await response.json();

            // รวมข้อมูล machine_img_after จาก close_task
            const updatedReportData = result.data.map((report) => {
                return {
                    ...report,
                    machine_img_after: report.closeTask
                        ? report.closeTask.machine_img_after
                        : null,
                };
            });

            setReportData(updatedReportData);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันสำหรับการเคลียร์ข้อมูลในฟอร์ม
    const handleReset = () => {
        reset();
        setError("");
        setReportData([]);
    };

    // ฟังก์ชันสำหรับการเคลียร์ฟิลด์วันที่เมื่อพิมพ์หมายเลขเครื่อง
    const handleMachineInputChange = () => {
        reset({
            startDate: "",
            endDate: "",
        });
    };

    // ฟังก์ชันสำหรับการเคลียร์ฟิลด์หมายเลขเครื่องเมื่อเลือกวันที่
    const handleDateInputChange = () => {
        reset({
            machine_SN: "",
            machine_Advice: "",
        });
    };

    const handleImageClick = (beforeImages, afterImages) => {
        const allImages = [...(beforeImages || []), ...(afterImages || [])];
        const validImages = allImages.filter(
            (img) => img && (img.startsWith("/") || img.startsWith("http"))
        );
        setSelectedImages(validImages);
        setCurrentImageIndex(0);
        setIsModalOpen(true);
    };

    const handleNextImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % selectedImages.length
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex(
            (prevIndex) =>
                (prevIndex - 1 + selectedImages.length) % selectedImages.length
        );
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">ค้นหาข้อมูลการซ่อมเครื่องจักร</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                <div>
                    <label htmlFor="machine_SN" className="block font-semibold mb-2">
                        หมายเลขเครื่อง (SN):
                    </label>
                    <input
                        type="text"
                        id="machine_SN"
                        {...register("machine_SN")}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="กรุณากรอกหมายเลขเครื่อง (SN) (ไม่บังคับ)"
                        onChange={handleMachineInputChange}
                    />
                </div>

                <div>
                    <label htmlFor="machine_Advice" className="block font-semibold mb-2">
                        หมายเลขเครื่อง (Advice):
                    </label>
                    <input
                        type="text"
                        id="machine_Advice"
                        {...register("machine_Advice")}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="กรุณากรอกหมายเลขเครื่อง (Advice) (ไม่บังคับ)"
                        onChange={handleMachineInputChange}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        ช่วงวันที่ (สร้างหรือปิดงาน):
                    </label>
                    <div className="flex space-x-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm">
                                วันที่เริ่มต้น:
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                {...register("startDate")}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleDateInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm">
                                วันที่สิ้นสุด:
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                {...register("endDate")}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleDateInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? "กำลังค้นหา..." : "ค้นหา"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary w-full"
                    >
                        ล้างข้อมูล
                    </button>
                </div>
            </form>

            {/* ส่วนแสดงผลลัพธ์การค้นหา */}
            {loading ? (
                <div className="text-center mt-6">กำลังโหลดข้อมูล...</div>
            ) : (
                <>
                    {reportData.length > 0 ? (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">ผลการค้นหา:</h3>
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-4 py-2">รหัสเครื่องจักร</th>
                                        <th className="border px-4 py-2">ปิดงานโดย</th>
                                        <th className="border px-4 py-2">วันที่ปิดงาน</th>
                                        <th className="border px-4 py-2">รูปก่อนซ่อม</th>
                                        <th className="border px-4 py-2">รูปหลังซ่อม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((report) => (
                                        <tr key={report.id}>
                                            <td className="border px-4 py-2">
                                                {report.machine.machine_id}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {report.user?.fullName || "N/A"}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {report.successAt
                                                    ? new Date(report.successAt).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td className="border px-4 py-2 flex space-x-2">
                                                {report.machine_img_before &&
                                                    report.machine_img_before.length > 0 ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            handleImageClick(
                                                                report.machine_img_before,
                                                                "before"
                                                            )
                                                        }
                                                    >
                                                        ดูรูปก่อนซ่อม
                                                    </button>
                                                ) : (
                                                    "ไม่มีข้อมูล"
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {report.closeTask?.machine_img_after &&
                                                    report.closeTask.machine_img_after.length > 0 ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            handleImageClick(
                                                                report.closeTask.machine_img_after,
                                                                "after"
                                                            )
                                                        }
                                                    >
                                                        ดูรูปหลังซ่อม
                                                    </button>
                                                ) : (
                                                    "ไม่มีข้อมูล"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="mt-8 text-center text-gray-600">
                            ไม่พบข้อมูลการซ่อมที่ตรงกับการค้นหา
                        </div>
                    )}
                </>
            )}

            {/* Modal สำหรับแสดงภาพขนาดใหญ่ */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Image Modal"
                className="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white"
            >
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                >
                    ปิด
                </button>
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() =>
                            setCurrentImageIndex(
                                (prevIndex) =>
                                    (prevIndex - 1 + selectedImages.length) %
                                    selectedImages.length
                            )
                        }
                        className="btn btn-primary mr-4"
                    >
                        ก่อนหน้า
                    </button>
                    {selectedImages[currentImageIndex] ? (
                        <Image
                            src={selectedImages[currentImageIndex]}
                            alt={`Repair Image ${currentImageIndex + 1}`}
                            className="w-full h-auto"
                            width={600}
                            height={600}
                        />
                    ) : (
                        <p>ไม่มีรูปภาพให้แสดง</p>
                    )}
                    <button
                        onClick={() =>
                            setCurrentImageIndex(
                                (prevIndex) => (prevIndex + 1) % selectedImages.length
                            )
                        }
                        className="btn btn-primary ml-4"
                    >
                        ถัดไป
                    </button>
                </div>
                <p className="text-center mt-2">
                    รูปที่ {currentImageIndex + 1} จาก {selectedImages.length}
                </p>
            </Modal>
        </div>
    );
}
