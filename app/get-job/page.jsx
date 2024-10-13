// "use client";

// import ModelComponent from "@/components/ModelComponent";
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";

// const GetJob = () => {
//     const [machines, setMachines] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { register, handleSubmit, reset, formState: { errors } } = useForm(); // เพิ่ม errors สำหรับแสดงข้อความผิดพลาด

//     useEffect(() => {
//         fetchMachines();
//     }, []);

//     const fetchMachines = async () => {
//         try {
//             setIsLoading(true);
//             const response = await fetch("/api/machine");
//             if (!response.ok) {
//                 throw new Error("Failed to fetch machines");
//             }
//             const data = await response.json();
//             // กรองข้อมูลให้แสดงเฉพาะเครื่องที่มีสถานะ pending
//             const pendingMachines = data.filter(
//                 (machine) =>
//                     machine.tasks.length === 0 ||
//                     machine.tasks.every((task) => task.task_status === "pending")
//                 // machine.machine_status === 'pending'
//             );

//             setMachines(pendingMachines);
//         } catch (error) {
//             console.error("Error fetching machines:", error);
//             setError("Failed to load machines. Please try again later.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // const handleSelectMachine = async (machine,data) => {
//     //     try {
//     //         const formData = new FormData(); // ใช้ FormData สำหรับส่งไฟล์และข้อมูล

//     //         formData.append("taskname", machine.name);
//     //         formData.append("machineId", machine.id);
//     //         formData.append("task_status", "fixing");

//     //           // เพิ่มรูปก่อนซ่อมลงใน FormData
//     //         formData.append("machine_img_before", data.beforeImage[0]); 
//     //         // เพิ่มไฟล์ทั้งหมดที่เลือกลงใน formData

//     //         const response = await fetch("/api/task", {
//     //             method: "POST",
//     //             body: formData,
//     //         });

//     //         if (!response.ok) {
//     //             throw new Error("Failed to create task");
//     //         }

//     //         const result = await response.json();
//     //         if (result.success) {
//     //             // ลบเครื่องที่ถูกเลือกออกจากรายการ
//     //             setMachines(machines.filter((m) => m.id !== machine.id));
//     //             alert("Task created successfully!");
//     //             reset()
//     //         } else {
//     //             throw new Error(result.message || "Failed to create task");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error creating task:", error);
//     //         setError("Failed to create task. Please try again.");
//     //     }
//     // };
//     const handleSelectMachine = async (machine, data) => {
//         try {
//             const formData = new FormData();
//             formData.append("taskname", machine.name);
//             formData.append("machineId", machine.id);
//             formData.append("task_status", "fixing");

//             // เพิ่มรูปหลายรูปใน FormData
//             for (const file of data.beforeImage) {
//                 formData.append("beforeImage", file);
//             }

//             const response = await fetch("/api/task", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to create task");
//             }

//             const result = await response.json();
//             if (result.success) {
//                 document.getElementById(`modal-task-${machine.id}`).checked = false;
//                 fetchMachines();
//                 alert("Task created successfully!");
//                 reset();
//             } else {
//                 throw new Error(result.message || "Failed to create task");
//             }
//         } catch (error) {
//             console.error("Error creating task:", error);
//             setError("Failed to create task. Please try again.");
//         }
//     };


//     if (isLoading) {
//         return <div className="text-center mt-10">Loading machines...</div>;
//     }

//     return (
//         <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
//             <h2 className="text-2xl font-bold mb-4">Select a Machine to Get a Job</h2>
//             {error && (
//                 <div className="alert alert-error mb-4">
//                     <p>{error}</p>
//                 </div>
//             )}
//             {machines.length === 0 ? (
//                 <p>No machines available</p>
//             ) : (
//                 <ul className="space-y-4">
//                     {machines.map((machine) => (
//                         <li
//                             key={machine.id}
//                             className="flex justify-between items-center p-4 border rounded hover:bg-gray-100"
//                         >
//                             <span className=" w-3/4">
//                                 {machine.name || "Unknown Machine"}
//                             </span>
//                             <div className="flex flex-row gap-2 w-full justify-end items-center">
//                                 {/* ModelComponent สำหรับรายละเอียด */}
//                                 <ModelComponent
//                                     modalId={`modal-details-${machine.id}`} // ใช้ modalId ที่ไม่ซ้ำกัน
//                                     style="btn btn-success w-28"
//                                     titleBtn="รายละเอียด"
//                                     modelTitle={machine.name}
//                                     details={machine.machine_des || "ไม่มีรายละเอียด"}
//                                     tel={machine.machine_tel}
//                                 >
//                                     <div>
//                                         <button
//                                             className="btn btn-error"
//                                             onClick={() =>
//                                             (document.getElementById(
//                                                 `modal-details-${machine.id}`
//                                             ).checked = false)
//                                             }
//                                         >
//                                             Close
//                                         </button>
//                                     </div>
//                                 </ModelComponent>

//                                 {/* ModelComponent สำหรับรับงาน */}
//                                 <ModelComponent
//                                     modalId={`modal-task-${machine.id}`} // modalId ที่ไม่ซ้ำกัน
//                                     style="btn btn-primary w-28"
//                                     titleBtn="รับงาน"
//                                     modelTitle={machine.name}
//                                     details={machine.machine_des || "ไม่มีรายละเอียด"}
//                                     tel={machine.machine_tel}
//                                 >
//                                     {/* ใช้ form จาก React Hook Form */}
//                                     <form onSubmit={handleSubmit((data) => handleSelectMachine(machine, data))} encType="multipart/form-data">
//                                         <div className="flex flex-row w-full gap-3">
//                                             <input
//                                                 type="file"
//                                                 className="input-file"
//                                                 {...register("beforeImage", {
//                                                     validate: (value) => value?.length > 0 || "Please upload at least one image", // ตรวจสอบว่า array ของไฟล์มีอย่างน้อย 1 ไฟล์
//                                                 })}
//                                                 multiple
//                                                 accept="image/*"
//                                             />
//                                             {/* แสดงข้อความผิดพลาดถ้าไม่มีการอัปโหลดรูป */}
//                                             {errors.beforeImage && <p className="text-red-500">{errors.beforeImage.message}</p>}

//                                             <button type="submit" className="btn btn-primary w-28">
//                                                 รับงาน
//                                             </button>
//                                         </div>
//                                     </form>


//                                 </ModelComponent>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default GetJob;


"use client";

import ModelComponent from "@/components/ModelComponent";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const GetJob = () => {
    const [machines, setMachines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/machine");
            if (!response.ok) {
                throw new Error("Failed to fetch machines");
            }
            const data = await response.json();
            const pendingMachines = data.filter(
                (machine) =>
                    machine.tasks.length === 0 ||
                    machine.tasks.every((task) => task.task_status === "pending")
            );
            setMachines(pendingMachines);
        } catch (error) {
            console.error("Error fetching machines:", error);
            setError("Failed to load machines. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMachine = async (machine, data) => {
        try {
            const formData = new FormData();
            formData.append("taskname", machine.name);
            formData.append("machineId", machine.id);
            formData.append("task_status", "fixing");

            // เพิ่มรูปหลายรูปใน FormData
            for (const file of data.beforeImage) {
                formData.append("beforeImage", file);
            }

            const response = await fetch("/api/task", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const result = await response.json();
            if (result.success) {
                document.getElementById(`modal-task-${machine.id}`).checked = false;
                fetchMachines();
                alert("Task created successfully!");
                reset();
            } else {
                throw new Error(result.message || "Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            setError("Failed to create task. Please try again.");
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10">Loading machines...</div>;
    }

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Select a Machine to Get a Job</h2>
            {error && (
                <div className="alert alert-error mb-4">
                    <p>{error}</p>
                </div>
            )}
            {machines.length === 0 ? (
                <p>No machines available</p>
            ) : (
                <ul className="space-y-4">
                    {machines.map((machine) => (
                        <li
                            key={machine.id}
                            className="flex justify-between items-center p-4 border rounded hover:bg-gray-100"
                        >
                            <span className=" w-3/4">
                                {machine.name || "Unknown Machine"}
                            </span>
                            <div className="flex flex-row gap-2 w-full justify-end items-center">
                                {/* ModelComponent สำหรับรับงาน */}
                                <ModelComponent
                                    modalId={`modal-task-${machine.id}`} 
                                    style="btn btn-primary w-28"
                                    titleBtn="รับงาน"
                                    modelTitle={machine.name}
                                    details={machine.machine_des || "ไม่มีรายละเอียด"}
                                    tel={machine.machine_tel}
                                >
                                    {/* ใช้ form จาก React Hook Form */}
                                    <form onSubmit={handleSubmit((data) => handleSelectMachine(machine, data))} encType="multipart/form-data">
                                        <div className="flex flex-row w-full gap-3">
                                            <input
                                                type="file"
                                                className="input-file"
                                                {...register("beforeImage", {
                                                    validate: (value) => value?.length > 0 || "Please upload at least one image",
                                                })}
                                                multiple
                                                accept="image/*"
                                            />
                                            {errors.beforeImage && <p className="text-red-500">{errors.beforeImage.message}</p>}

                                            <button type="submit" className="btn btn-primary w-28">
                                                รับงาน
                                            </button>
                                        </div>
                                    </form>
                                </ModelComponent>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GetJob;
