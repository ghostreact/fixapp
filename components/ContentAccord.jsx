"use client";

import React, { useEffect, useState } from "react";
import ModelComponent from "./ModelComponent";
import { useForm } from "react-hook-form";

export default function ContentAccord() {
    const [taskSets, setTaskSets] = useState([]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch("/api/dashboard-list");
                if (res.ok) {
                    const data = await res.json();
                    setTaskSets(
                        Array.isArray(data.getlistfixed) ? data.getlistfixed : []
                    ); // ตรวจสอบให้แน่ใจว่าเป็น array
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchTask();
    }, []);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // ฟังก์ชันปิดงาน
    const handleCloseJob = async (data, taskId) => {
        try {
            const formData = new FormData();
            formData.append("taskCloseDetails", data.taskCloseDetails);
            if (data.afterImage?.length > 0) {
                Array.from(data.afterImage).forEach((file) => {
                    formData.append("afterImage", file);
                });
            }

            const res = await fetch(`/api/close/${taskId}`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                // อัปเดตรายการ tasks หลังจากปิดงาน
                window.location.reload();
                setTaskSets((prevTaskSets) =>
                    prevTaskSets.filter((task) => task.id !== taskId)
                );
                reset();
            } else {
                console.error("Error closing the job:", res.statusText);
            }
        } catch (error) {
            console.error("Error closing the job:", error);
        }
    };

    return (
        <div className="accordion-group accordion-group-bordered">
            {taskSets.length === 0 ? (
                <p>No tasks available</p>
            ) : (
                taskSets.map((task) => (
                    <div key={task.id} className="accordion">
                        <input
                            type="checkbox"
                            id={`toggle-${task.id}`}
                            className="accordion-toggle"
                        />
                        <label
                            htmlFor={`toggle-${task.id}`}
                            className="accordion-title flex flex-row justify-between items-center"
                        >
                            <span>{task.taskname}</span> {/* ชื่องาน */}
                            <div className="">
                                <ModelComponent
                                    modalId={`modal-task-${task.id}`}
                                    style="btn btn-error w-28" // modalId ที่ไม่ซ้ำกัน
                                    modelTitle={task.taskname}
                                    titleBtn="ปิด Job"
                                >
                                    {/* ฟอร์มสำหรับการปิดงาน */}
                                    <form
                                        onSubmit={handleSubmit((data) =>
                                            handleCloseJob(data, task.id)
                                        )}
                                        encType="multipart/form-data"
                                    >
                                        <div className="mb-4 w-full">
                                            <label htmlFor="taskCloseDetails" className="block mb-2 font-normal">
                                                รายละเอียดการปิดงาน:
                                            </label>
                                            <textarea
                                                id="taskCloseDetails"
                                                {...register("taskCloseDetails", {
                                                    required: "กรุณาใส่รายละเอียดการปิดงาน",
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded font-normal"
                                                placeholder="กรุณาใส่รายละเอียดการปิดงาน"
                                            ></textarea>
                                            {errors.taskCloseDetails && (
                                                <p className="text-red-500">{errors.taskCloseDetails.message}</p>
                                            )}
                                        </div>
                                        <div className="pt-4">
                                            <label htmlFor="afterImage" className="block mb-2 font-normal">
                                                อัปโหลดรูปภาพหลังซ่อมเสร็จ:
                                            </label>
                                            <input
                                                type="file"
                                                id="afterImage"
                                                multiple
                                                accept="image/*" // กำหนดให้รับเฉพาะรูปภาพ
                                                {...register("afterImage")}
                                                className="input-file"
                                            />
                                        </div>
                                        {/* ปุ่ม OK ปิดงาน */}
                                        <div className="pt-2">
                                            <button type="submit" className="btn btn-secondary">
                                                OK
                                            </button>
                                        </div>
                                    </form>
                                </ModelComponent>
                            </div>
                        </label>

                        <div className="accordion-content text-content2">
                            <div className="min-h-0 grid grid-cols-1" style={{}}>
                                <div className="flex flex-col">
                                    <p>
                                        <strong>รายละเอียดงาน:</strong>{" "}
                                        {task.machine_des || "ไม่มีรายละเอียด"}
                                    </p>{" "}
                                    {/* รายละเอียดงาน */}
                                    <p>
                                        <strong>สถานะ:</strong> {task.task_status}
                                    </p>{" "}
                                    {/* สถานะงาน */}
                                    <p>
                                        <strong>วันที่เริ่มงาน:</strong>{" "}
                                        {new Date(task.createdAt).toLocaleString()}
                                    </p>{" "}
                                    {/* วันที่เริ่มงาน */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
