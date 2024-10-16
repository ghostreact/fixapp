import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import Link from "next/link";
const localizer = momentLocalizer(moment);

function EmployeeCalendar() {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // ดึงข้อมูลจาก API (events)
        fetch("/api/events")
            .then((response) => response.json())
            .then((data) => {
                if (data.holidays && data.meetings) {
                    const holidayEvents = data.holidays.map((holiday) => ({
                        title: `วันหยุด: ${holiday.holiday_type}`,
                        start: new Date(holiday.holiday_start),
                        end: new Date(holiday.holiday_end),
                        allDay: true,
                    }));

                    const meetingEvents = data.meetings.map((meeting) => ({
                        title: `นัดหมาย: ${meeting.meeting_name}`,
                        start: new Date(meeting.meeting_date),
                        end: new Date(meeting.meeting_date),
                        allDay: false,
                    }));

                    setEvents([...holidayEvents, ...meetingEvents]);
                }
            });
    }, []);

    // ฟังก์ชันในการแสดงชื่อเดือนปัจจุบัน
    const getCurrentMonth = () => {
        return moment(currentDate).format("MMMM YYYY"); // แสดงชื่อเดือนและปี
    };

    return (
        <div>
            <div className="grid grid-row gap-3">
                <div>
                    <h3>ปฏิทินการนัดหมายและวันหยุดพนักงาน เดือน {getCurrentMonth()}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="btn btn-success  h-16 text-base">
                        <Link href={"/holiday"} className=" gap-3 p-3 flex flex-row justify-center items-center ">
                            <RiCalendarScheduleLine />
                            เพิ่มวันหยุด
                        </Link>
                    </button>

                    <button className="btn btn-warning h-16 text-base">
                        <Link href={"/meeting"} className=" gap-3 p-3 flex flex-row justify-center items-center ">
                            <FaCalendarAlt />
                            เพิ่มการนัดลูกค้า
                        </Link>
                    </button>
                </div>
            </div>
            <h2 className="flex py-4 justify-center">{getCurrentMonth()}</h2>{" "}
            {/* แสดงชื่อเดือนปัจจุบัน */}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                toolbar={false}
            />
        </div>
    );
}

export default EmployeeCalendar;
