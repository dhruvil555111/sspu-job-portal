import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { studentAPI, adminAPI, interviewAPI } from '../services/api';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineCalendar, HiOutlineClock, HiOutlineBriefcase, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        let drivesList = [];
        let interviewsList = [];

        if (isAuthenticated) {
          if (user.role === 'student' || user.role === 'alumni') {
            const [drivesRes, interviewsRes] = await Promise.all([
              studentAPI.getPlacementDrives(),
              interviewAPI.getStudentInterviews(),
            ]);
            drivesList = drivesRes.data.drives || [];
            interviewsList = interviewsRes.data.interviews || [];
          } else if (user.role === 'recruiter') {
            const [drivesRes, interviewsRes] = await Promise.all([
              adminAPI.getPlacementDrives(), // recruiters can see all drives
              interviewAPI.getRecruiterInterviews(),
            ]);
            drivesList = drivesRes.data.drives || [];
            interviewsList = interviewsRes.data.interviews || [];
          } else {
            // TPO/Admin
            const [drivesRes, interviewsRes] = await Promise.all([
              adminAPI.getPlacementDrives(),
              interviewAPI.getAll(),
            ]);
            drivesList = drivesRes.data.drives || [];
            interviewsList = interviewsRes.data.interviews || [];
          }
        } else {
          // Public view - only drives
          const { data } = await adminAPI.getPlacementDrives();
          drivesList = data.drives || [];
        }

        // Map events
        const mappedDrives = drivesList.map(d => ({
          id: d._id,
          title: `Drive: ${d.company?.name || 'Recruiter'}`,
          type: 'drive',
          date: new Date(d.date),
          time: 'All Day',
          venue: d.venue || 'SSPU Campus',
          extra: d.title,
        }));

        const mappedInterviews = interviewsList.map(i => ({
          id: i._id,
          title: `Interview: ${i.job?.title || 'Job Round'}`,
          type: 'interview',
          date: new Date(i.date),
          time: i.time,
          venue: i.venue || i.link || i.mode,
          extra: `${i.title} (${i.status})`,
        }));

        setEvents([...mappedDrives, ...mappedInterviews]);
      } catch (error) {
        toast.error('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarData();
  }, [isAuthenticated, user]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDayClick = (dayNum) => {
    const clickedDate = new Date(year, month, dayNum);
    setSelectedDay(clickedDate);
    
    // Filter events for this day
    const dayEvents = events.filter(event => 
      event.date.getDate() === dayNum &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
    setSelectedDayEvents(dayEvents);
  };

  // Pre-load events for today on load
  useEffect(() => {
    if (events.length > 0) {
      const today = new Date();
      const todayEvents = events.filter(event => 
        event.date.getDate() === today.getDate() &&
        event.date.getMonth() === today.getMonth() &&
        event.date.getFullYear() === today.getFullYear()
      );
      setSelectedDayEvents(todayEvents);
      setSelectedDay(today);
    }
  }, [events]);

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            Placement & Interview Calendar
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
            Track your interview schedule and upcoming recruitment drives in one consolidated calendar board.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Body */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
            
            {/* Header controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-dark-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 rounded-xl bg-dark-50 hover:bg-dark-100 dark:bg-dark-800 dark:hover:bg-dark-700 transition-colors">
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-xl bg-dark-50 hover:bg-dark-100 dark:bg-dark-800 dark:hover:bg-dark-700 transition-colors">
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-dark-400 mb-2">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Blank placeholders for first week offsets */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-dark-50/20 dark:bg-dark-950/20 rounded-xl" />
              ))}

              {/* Days list */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const hasDrives = events.some(e => e.type === 'drive' && e.date.getDate() === dayNum && e.date.getMonth() === month && e.date.getFullYear() === year);
                const hasInterviews = events.some(e => e.type === 'interview' && e.date.getDate() === dayNum && e.date.getMonth() === month && e.date.getFullYear() === year);
                const isSelected = selectedDay.getDate() === dayNum && selectedDay.getMonth() === month && selectedDay.getFullYear() === year;

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => handleDayClick(dayNum)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-between p-2 text-xs font-semibold border transition-all ${
                      isSelected 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md' 
                        : 'bg-dark-50/50 hover:bg-dark-100/50 dark:bg-dark-950/40 dark:hover:bg-dark-800/40 border-dark-100 dark:border-dark-850'
                    }`}
                  >
                    <span>{dayNum}</span>
                    <div className="flex gap-1">
                      {hasDrives && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-pink-500'}`} />}
                      {hasInterviews && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-400'}`} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 text-xs text-dark-500 border-t border-dark-50 dark:border-dark-850 pt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Placement Drives
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Scheduled Interviews
              </span>
            </div>

          </div>

          {/* Day Event Details */}
          <div className="lg:col-span-1 bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md">
            <h3 className="font-display font-bold text-dark-900 dark:text-white border-b border-dark-50 dark:border-dark-850 pb-4 mb-4 text-sm uppercase tracking-wide">
              Schedule for {selectedDay.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </h3>

            {loading ? (
              <div className="space-y-4">
                <div className="skeleton h-16 rounded-xl" />
                <div className="skeleton h-16 rounded-xl" />
              </div>
            ) : selectedDayEvents.length === 0 ? (
              <div className="text-center py-10">
                <HiOutlineCalendar className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-2" />
                <p className="text-xs text-dark-400">No scheduled drives or interviews for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      ev.type === 'drive'
                        ? 'border-pink-500/20 bg-pink-500/5'
                        : 'border-primary-500/20 bg-primary-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        ev.type === 'drive' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                      }`}>
                        {ev.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-dark-400 font-semibold flex items-center gap-1">
                        <HiOutlineClock className="w-3.5 h-3.5" /> {ev.time}
                      </span>
                    </div>

                    <h4 className="font-bold text-dark-900 dark:text-white leading-snug mb-1">{ev.title}</h4>
                    <p className="text-dark-500 font-medium">{ev.extra}</p>
                    
                    <p className="text-[10px] text-primary-500 mt-2 font-semibold">
                      {ev.type === 'drive' ? 'Venue: ' : 'Details: '}
                      <span className="text-dark-600 dark:text-dark-300 font-normal">{ev.venue}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Calendar;
