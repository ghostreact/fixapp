import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const HolidaysDashboard = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('/api/holidays');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error('Error fetching holidays data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const events = holidays.map((holiday) => ({
    title: `${holiday.employeeName} - ${holiday.daysTakenThisMonth} Days Taken`,
    start: moment(holiday.startDate).toDate(),
    end: moment(holiday.endDate).toDate(),
    allDay: true,
  }));

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Employee Holidays Overview</h2>
      <div className="mb-8">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Employee Name</th>
            <th className="px-4 py-2 border">Days Taken This Month</th>
            <th className="px-4 py-2 border">Remaining Days</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.employeeId}>
              <td className="px-4 py-2 border">{holiday.employeeName}</td>
              <td className="px-4 py-2 border">{holiday.daysTakenThisMonth}</td>
              <td className="px-4 py-2 border">{holiday.remainingDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HolidaysDashboard;