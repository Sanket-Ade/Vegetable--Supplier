"use client";
import React, { useState, useEffect } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Loader2, Plus, CheckCircle2 } from 'lucide-react';

const FarmerCalendar = ({ isOpen, onClose, farmerId }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scheduleTitle, setScheduleTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allSchedules, setAllSchedules] = useState([]); // Store all tasks
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);

    // 1. Fetch all schedules for this farmer
    const fetchSchedules = async () => {
        if (!farmerId) return;
        setIsLoadingTasks(true);
        try {
            const res = await fetch(`/api/schedules?farmerId=${farmerId}`);
            const data = await res.json();
            if (data.success) setAllSchedules(data.schedules);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            setCurrentMonth(today);
            setSelectedDate(today);
            fetchSchedules(); // Fetch when opened
        }
    }, [isOpen, farmerId]);

    // 2. Filter tasks for the date the user clicks on
    const selectedDateTasks = allSchedules.filter(task => 
        isSameDay(new Date(task.date), selectedDate)
    );

    const handleAddSchedule = async () => {
        if (!scheduleTitle.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmerId, title: scheduleTitle, date: selectedDate })
            });
            const data = await res.json();
            if (data.success) {
                setScheduleTitle("");
                fetchSchedules(); // Refresh the list
            }
        } catch (err) { console.error(err); } 
        finally { setIsSubmitting(false); }
    };

    if (!isOpen) return null;

    // Helper: Check if a day has any tasks (to show a dot)
    const hasTasks = (day) => allSchedules.some(task => isSameDay(new Date(task.date), day));

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-scale-up border border-slate-100 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X size={20} />
                </button>
                
                {/* Header & Days remain same as before... */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="text-emerald-500" />
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2 mr-[35px]">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {eachDayOfInterval({ 
                        start: startOfWeek(startOfMonth(currentMonth)), 
                        end: endOfWeek(endOfMonth(currentMonth)) 
                    }).map((day, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedDate(day)}
                            className={`h-12 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all relative
                                ${!isSameMonth(day, currentMonth) ? 'text-slate-300' : 'text-slate-700'}
                                ${isSameDay(day, selectedDate) ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50'}
                            `}
                        >
                            <span className="text-sm font-semibold">{format(day, 'd')}</span>
                            {/* NEW: Green dot if task exists */}
                            {hasTasks(day) && (
                                <div className={`w-1 h-1 rounded-full mt-0.5 ${isSameDay(day, selectedDate) ? 'bg-white' : 'bg-emerald-500'}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- DISPLAY SECTION --- */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">
                        Tasks for {format(selectedDate, 'do MMMM')}
                    </h4>
                    
                    {/* List of existing tasks */}
                    <div className="space-y-2 mb-4">
                        {selectedDateTasks.length > 0 ? selectedDateTasks.map((task) => (
                            <div key={task._id} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-sm font-medium text-slate-700">{task.title}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-400 italic">No tasks scheduled for this day.</p>
                        )}
                    </div>

                    {/* Add New Task Input */}
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            placeholder="Add new task..."
                            value={scheduleTitle}
                            onChange={(e) => setScheduleTitle(e.target.value)}
                            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
                        />
                        <button 
                            onClick={handleAddSchedule}
                            disabled={isSubmitting}
                            className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerCalendar;