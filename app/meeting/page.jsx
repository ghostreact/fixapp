"use client";
import { useForm } from "react-hook-form";

export default function CreateMeetingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // ส่งข้อมูลไปยัง backend
    fetch('/api/meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          ชื่อการนัดหมาย
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.name && <span className="text-red-500 text-sm">กรุณากรอกชื่อการนัดหมาย</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700">
          วันที่นัดหมาย
        </label>
        <input
          type="date"
          id="meeting_date"
          {...register("meeting_date", { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.meeting_date && <span className="text-red-500 text-sm">กรุณาเลือกวันที่</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="meeting_tel" className="block text-sm font-medium text-gray-700">
          เบอร์ติดต่อ
        </label>
        <input
          type="tel"
          id="meeting_tel"
          {...register("meeting_tel", { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.meeting_tel && <span className="text-red-500 text-sm">กรุณากรอกเบอร์ติดต่อ</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="meeting_des" className="block text-sm font-medium text-gray-700">
          รายละเอียดการนัดหมาย
        </label>
        <textarea
          id="meeting_des"
          {...register("meeting_des", { required: true })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
        {errors.meeting_des && <span className="text-red-500 text-sm">กรุณากรอกรายละเอียด</span>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        บันทึกการนัดหมาย
      </button>
    </form>
  );
}
