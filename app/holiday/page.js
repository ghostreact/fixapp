"use client";

import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";


export default function AddHolidayForm({ userId }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [overLimit, setOverLimit] = useState(false);

  // ฟังก์ชันคำนวณจำนวนวัน
  const calculateDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    // คำนวณจำนวนวัน โดยรวมวันที่สิ้นสุดด้วย ให้บวก 1 วัน
    const diffInMilliseconds = endDate - startDate;
    const daysDifference = diffInMilliseconds / (1000 * 60 * 60 * 24) + 1;
  
    return daysDifference;
  };
  

  // สังเกตค่าที่เปลี่ยนแปลงในฟอร์ม
  const holidayStart = watch('holiday_start');
  const holidayEnd = watch('holiday_end');

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

  // ฟังก์ชันเมื่อส่งฟอร์ม
  const onSubmit = (data) => {
    const totalDays = calculateDaysBetween(data.holiday_start, data.holiday_end);
  
    const payload = {
      ...data,
      totalDays: totalDays, // ส่งจำนวนวันหยุดไปที่ backend
      overlimit: totalDays > 1 && data.holiday_type === "Personal", // ตรวจสอบเงื่อนไข overlimit
      switch_holiday : false,
      username : data.username
    };
  
    fetch(`/api/holiday`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="holidayStart">วันเริ่มต้น</label>
        <input
          type="date"
          id="holidayStart"
          {...register('holiday_start', { required: true })}
        />
        {errors.holiday_start && <span>กรุณาเลือกวันเริ่มต้น</span>}
      </div>

      <div>
        <label htmlFor="holidayEnd">วันสิ้นสุด</label>
        <input
          type="date"
          id="holidayEnd"
          {...register('holiday_end', { required: true })}
        />
        {errors.holiday_end && <span>กรุณาเลือกวันสิ้นสุด</span>}
      </div>

      <div>
        <label htmlFor="holidayType">ประเภทวันหยุด</label>
        <select
          id="holidayType"
          {...register('holiday_type', { required: true })}
        >
          <option value="">เลือกประเภท</option>
          <option value="Annual">วันหยุดประจำปี</option>
          <option value="Sick">วันลาป่วย</option>
          <option value="Personal">วันลาส่วนตัว</option>
        </select>
        {errors.holiday_type && <span>กรุณาเลือกประเภทวันหยุด</span>}
      </div>

      {/* แสดงจำนวนวัน */}
      <div>
        <label>จำนวนวันหยุด: </label>
        <span>{totalDays}</span> วัน
      
      </div>

      <button type="submit">บันทึกวันหยุด</button>
      <button onClick={()=> signOut()}>Log Out</button>
    </form>
  );
}