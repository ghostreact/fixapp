"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { brandsNB, typeMachine } from "@/models/brands";

export default function CreateMachineForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm(); 
  const [meetings, setMeetings] = useState([]);
  const [isMeetingLinked, setIsMeetingLinked] = useState(false);

  useEffect(() => {
    fetch("/api/meeting") // ดึงข้อมูลการนัดหมายจาก API
      .then((response) => response.json())
      .then((data) => setMeetings(data))
      .catch((error) => console.error("Error fetching meetings:", error));
  }, []);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      machine_img: data.machine_img || null, // ถ้าไม่มีการใส่ค่าให้เป็น null
      machine_meet: isMeetingLinked,
    };

    fetch("/api/machine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleReset = () => {
    reset(); // ฟังก์ชันนี้จะเคลียร์ค่าทั้งหมดในฟอร์ม
  };

  return (
    <div className="m-5 border border-gray-400 border-spacing-3 rounded-lg p-4">
<form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4  rounded-lg "
    >
      <div>
        <label htmlFor="name">ชื่อเครื่องจักร</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <span className="text-red-500">กรุณากรอกชื่อเครื่องจักร</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1">
        <div className="flex gap-2 items-center">
          <label htmlFor="machine_type">ประเภทเครื่องจักร</label>
          <select
            className="select select-md select-ghost-primary"
            id="machine_type"
            {...register("machine_type", { required: true })}
          >
            {typeMachine.map((name) => (
              <option key={name.name} value={name.name}>
                {name.name}
              </option>
            ))}
          </select>

          <label htmlFor="machine_model">ยี่ห้อเครื่อง</label>
          <select
            className="select select-md select-ghost-primary"
            id="machine_model"
            {...register("machine_model")}
          >
            {brandsNB.map((brand) => (
              <option key={brand.name} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="machine_des">รายละเอียดเครื่องจักร</label>
        <textarea
          id="machine_des"
          {...register("machine_des")}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1">
        <div className="flex gap-2">
          <label htmlFor="machine_SN">หมายเลขเครื่อง (SN) </label>
          <input
            type="text"
            id="machine_SN"
            {...register("machine_SN")}
            className=" w-full border border-gray-300 rounded-md shadow-sm p-2"
          />

          <label htmlFor="machine_advice">หมายเลขเครื่อง (ADVICE_CODE) </label>
          <input
            type="text"
            id="machine_advice"
            {...register("machine_advice")}
            className=" w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <label htmlFor="machine_img">ภาพเครื่องจักร (ไม่บังคับ)</label>
        <input
          type="file"
          id="machine_img"
          {...register("machine_img")}
          className="input-file input-file-primary w-full"
        />
      </div>

      <div>
        <label htmlFor="machine_Advice">
          คำแนะนำเกี่ยวกับเครื่องจักร (ไม่บังคับ)
        </label>
        <textarea
          id="machine_Advice"
          {...register("machine_Advice")}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div>
        <label htmlFor="hasMeeting">เครื่องจักรนี้มีการนัดหมายหรือไม่?</label>
        <input
          type="checkbox"
          id="hasMeeting"
          onChange={(e) => setIsMeetingLinked(e.target.checked)}
        />
      </div>

      {isMeetingLinked && (
        <div>
          <label htmlFor="meetId">เลือกการนัดหมาย</label>
          <select
            id="meetId"
            {...register("meetId")}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">-- เลือกการนัดหมาย --</option>
            {meetings.map((meeting) => (
              <option key={meeting.id} value={meeting.id}>
                {meeting.name} -{" "}
                {new Date(meeting.meeting_date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        บันทึกเครื่องจักร
      </button>

       {/* ปุ่ม Clear หรือ Reset */}
       <button
        type="button"
        onClick={handleReset} // เรียกใช้ฟังก์ชัน reset เมื่อคลิก
        className=" text-white px-4 py-2 rounded-md ml-4 btn btn-error"
      >
        ล้างค่า
      </button>
    </form>
    </div>
    
  );
}
