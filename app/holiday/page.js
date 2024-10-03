"use client";

import { signOut, useSession } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";

export default function AddHolidayForm({ userId }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [overLimit, setOverLimit] = useState(false);
  const [availableHolidays, setAvailableHolidays] = useState([]);
  const [isSwitching, setIsSwitching] = useState(false); // ใช้สำหรับควบคุมการแสดงฟิลด์
  const { data: session } = useSession();
  // สังเกตค่าที่เปลี่ยนแปลงในฟอร์ม
  const holidayStart = watch("holiday_start");
  const holidayEnd = watch("holiday_end");
  const switchHoliday = watch("switch_holiday");
  const targetHoliday = watch("target_holiday_id");

  // ฟังก์ชันคำนวณจำนวนวัน
  const calculateDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // คำนวณจำนวนวัน โดยรวมวันที่สิ้นสุดด้วย ให้บวก 1 วัน
    const diffInMilliseconds = endDate - startDate;
    const daysDifference = diffInMilliseconds / (1000 * 60 * 60 * 24) + 1;

    return daysDifference;
  };

  // ใช้ useMemo เพื่อคำนวณจำนวนวันเมื่อวันเริ่มต้นหรือสิ้นสุดเปลี่ยน
  const totalDays = useMemo(() => {
    if (holidayStart && holidayEnd) {
      const days = calculateDaysBetween(holidayStart, holidayEnd);
      if (days > 1) {
        setOverLimit(true);
      } else {
        setOverLimit(false);
      }
      return days;
    }
    return 0;
  }, [holidayStart, holidayEnd]); // คำนวณใหม่เฉพาะเมื่อ holidayStart หรือ holidayEnd เปลี่ยนแปลง

  // ดึงข้อมูลวันหยุดที่สามารถสลับได้
  useEffect(() => {
    const fetchAvailableHolidays = async () => {
      const response = await fetch("/api/holiday/switch");
      const result = await response.json();
      setAvailableHolidays(result.data); // ตั้งค่าใน state สำหรับแสดงวันหยุด
    };

    fetchAvailableHolidays();
  }, []);

  // เมื่อมีการเปลี่ยนแปลง checkbox switch_holiday
  useEffect(() => {
    if (switchHoliday && targetHoliday) {
      setIsSwitching(true); // ซ่อนฟิลด์เมื่อมีการเลือก switch
    } else {
      setIsSwitching(false); // แสดงฟิลด์หากไม่มีการเลือก
    }
  }, [switchHoliday, targetHoliday]);

  useEffect(() => {
    if (switchHoliday) {
      setIsSwitching(true); // ซ่อนฟิลด์เมื่อมีการเลือก switch
    } else {
      setIsSwitching(false); // แสดงฟิลด์ถ้าไม่ได้เลือก switch
    }
  }, [switchHoliday]);

  // ฟังก์ชันเมื่อส่งฟอร์ม
  const onSubmit = (data) => {
    const payload = {
      userId: session.user.username, // รหัสผู้ใช้ที่ขอสลับ
      holiday_start: data.holiday_start,
      holiday_end: data.holiday_end,
      overlimit: totalDays > 1 && data.holiday_type === "Personal", // ตรวจสอบเงื่อนไข overlimit
      holiday_type: data.holiday_type,
      switch_holiday: data.switch_holiday, // กำหนดสถานะของการสลับ
    };

    // ตรวจสอบว่าขอสลับหรือสร้างวันหยุดธรรมดา
    const apiUrl = data.switch_holiday
      ? `/api/holiday/${data.target_holiday_id}` // สำหรับการสลับวันหยุด
      : `/api/holiday`; // สำหรับการสร้างวันหยุดธรรมดา

    const method = data.switch_holiday ? "PUT" : "POST"; // เลือก method PUT สำหรับสลับวันหยุด

    fetch(apiUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card">
        <div className="card-body">
          <div className="card-header flex justify-center">
            <div className="flex flex-col gap-2">

              <h2 className=" text-center text-2xl font-semibold mx-auto max-w-xs  text-content2">
                ระบบสร้างวันหยุด
              </h2>
            </div>
          </div>
        <section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          
        >
          {!switchHoliday && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="holidayStart"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันเริ่มต้น
                </label>
                <input
                  type="date"
                  id="holidayStart"
                  {...register("holiday_start", { required: true })}
                  className="input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  error={errors.holiday_start ? "กรุณาเลือกวันเริ่มต้น" : ""}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="holidayEnd"
                  className="block text-sm font-medium text-gray-700"
                >
                  วันสิ้นสุด
                </label>
                <input
                  type="date"
                  id="holidayEnd"
                  {...register("holiday_end", { required: true })}
                  className="input mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  error={errors.holiday_end ? "กรุณาเลือกวันสิ้นสุด" : ""}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="holidayType"
                  className="block text-sm font-medium text-gray-700"
                >
                  ประเภทวันหยุด
                </label>
                <select
                  id="holidayType"
                  {...register("holiday_type", { required: true })}
                  className="select mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  error={errors.holiday_type ? "กรุณาเลือกประเภทวันหยุด" : ""}
                >
                  <option value="">เลือกประเภท</option>
                  <option value="Annual">วันหยุดประจำปี</option>
                  <option value="Sick">วันลาป่วย</option>
                  <option value="Personal">วันลาส่วนตัว</option>
                </select>
              </div>
            </>
          )}

          <div className="mb-4">
          <label class="flex cursor-pointer gap-2">
             <input
              id="switchHoliday"
              {...register("switch_holiday")}
              className="text-sm checkbox"
              type="checkbox"
            />
             <span>ขอสลับวันหยุด </span>
          </label>
           
          </div>

          {switchHoliday && availableHolidays.length > 0 && (
            <div className="mb-4">
              <label
                htmlFor="availableHolidays"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกวันหยุดที่ต้องการสลับ
              </label>
              <select
                id="availableHolidays"
                {...register("target_holiday_id")}
                className="select mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">เลือกวันหยุด</option>
                {availableHolidays.map((holiday) => (
                  <option
                    key={holiday.id}
                    value={holiday.id}
                    hidden={holiday.userId === session?.user?.username}
                  >
                    {holiday.userId} (
                    {moment(holiday.holiday_start).format("MMMM D, YYYY")} -{" "}
                    {moment(holiday.holiday_end).format("MMMM D, YYYY")})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!switchHoliday && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                จำนวนวันหยุด:
              </label>
              <span>{totalDays}</span> วัน
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            บันทึกวันหยุด
          </button>
          
        </form>
        </section>
        </div>
        
      </div>
    </div>
  );
}
