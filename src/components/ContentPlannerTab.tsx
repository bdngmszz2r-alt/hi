import { useState, useEffect, FormEvent } from 'react';
import { Calendar, Plus, Trash, Check, HelpCircle, RefreshCw, ListTodo, Sparkles } from 'lucide-react';
import { saveCalendarEvent, getCalendarEvents, deleteCalendarEvent } from '../lib/firebaseStore';

interface EventItem {
  id?: string;
  title: string;
  date: string;
  type: string;
  notes: string;
  status: 'draft' | 'scheduled' | 'uploaded';
  checklist: {
    hookChecked: boolean;
    seoChecked: boolean;
    thumbnailChecked: boolean;
  };
}

const defaultEvents: EventItem[] = [
  {
    id: "evt1",
    title: "10 Steps to Master Calisthenics",
    date: "2026-06-18",
    type: "Long Form",
    notes: "Requires heavy voiceover overlay matching the dynamic audio timeline.",
    status: "scheduled",
    checklist: { hookChecked: true, seoChecked: false, thumbnailChecked: true }
  },
  {
    id: "evt2",
    title: "Why AI Coding Tools are Not Safe 🫣",
    date: "2026-06-22",
    type: "Shorts",
    notes: "Vertical format testing high CTR caption colors.",
    status: "draft",
    checklist: { hookChecked: true, seoChecked: true, thumbnailChecked: false }
  }
];

export function ContentPlannerTab({ userId }: { userId?: string }) {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('Long Form');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (userId) {
      loadEventsFromDB();
    }
  }, [userId]);

  const loadEventsFromDB = async () => {
    setIsLoading(true);
    try {
      const records = await getCalendarEvents(userId!);
      if (records && records.length > 0) {
        setEvents(records.map(e => ({
          ...e,
          checklist: e.checklist || { hookChecked: false, seoChecked: false, thumbnailChecked: false }
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const newEvent: EventItem = {
      title: newTitle,
      date: newDate,
      type: newType,
      notes: newNotes,
      status: 'draft',
      checklist: { hookChecked: false, seoChecked: false, thumbnailChecked: false }
    };

    if (userId) {
      setIsLoading(true);
      try {
        const id = await saveCalendarEvent(userId, newEvent);
        newEvent.id = id;
        setEvents(prev => [...prev, newEvent]);
      } catch (err) {
        console.error("Save error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      newEvent.id = `local_${Date.now()}`;
      setEvents(prev => [...prev, newEvent]);
    }

    setNewTitle('');
    setNewDate('');
    setNewNotes('');
  };

  const handleDelete = async (eventId: string) => {
    if (userId) {
      setIsLoading(true);
      try {
        await deleteCalendarEvent(userId, eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const toggleChecklist = async (eventId: string, key: 'hookChecked' | 'seoChecked' | 'thumbnailChecked') => {
    const updated = events.map(e => {
      if (e.id === eventId) {
        const updatedChecklist = { ...e.checklist, [key]: !e.checklist[key] };
        return { ...e, checklist: updatedChecklist };
      }
      return e;
    });
    setEvents(updated);

    if (userId) {
      const found = updated.find(e => e.id === eventId);
      if (found) {
        await saveCalendarEvent(userId, found);
      }
    }
  };

  const changeStatus = async (eventId: string, status: 'draft' | 'scheduled' | 'uploaded') => {
    const updated = events.map(e => {
      if (e.id === eventId) {
        return { ...e, status };
      }
      return e;
    });
    setEvents(updated);

    if (userId) {
      const found = updated.find(e => e.id === eventId);
      if (found) {
        await saveCalendarEvent(userId, found);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🗓️ Content Release Calendar
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Coordinate your release schedules, log raw production notes, and check pre-publish checklist matrices before launching video.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side scheduling form */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-red-500 animate-pulse" />
              Schedule Video Release
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-400 font-semibold uppercase tracking-wider">Video Title Idea</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Stop wasting hours doing this..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 font-semibold uppercase tracking-wider">Release Date</label>
                <input 
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 text-xs"
                />
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-gray-400 font-semibold uppercase tracking-wider">Format</label>
                <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                >
                  <option value="Long Form">Long Form (16:9)</option>
                  <option value="Shorts">Short (9:16)</option>
                  <option value="Live stream">Live Broadcast</option>
                  <option value="Community Post">Community Grid</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 font-semibold uppercase tracking-wider">Production Insights notes</label>
                <textarea 
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Chapters, references, sponsors outlines, link list..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-red-purple text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-xs"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                Add Scheduled Outline
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Schedule card streams */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 px-4 border border-white/5">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">Release Queue Planner</span>
            <span className="text-xs text-red-400 font-mono font-bold">● {events.length} Planned videos</span>
          </div>

          <div className="space-y-4">
            {events.map((evt, idx) => (
              <div 
                key={evt.id || idx}
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Event core data */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-red-955/35 text-red-400 font-bold font-mono p-1 rounded-sm border border-red-500/20">
                      {evt.date}
                    </span>
                    <span className="text-[10px] bg-purple-955/35 text-purple-300 font-bold px-2 rounded-full border border-purple-900/25">
                      {evt.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      evt.status === 'uploaded' 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                        : evt.status === 'scheduled' 
                        ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' 
                        : 'bg-yellow-950/40 text-yellow-500'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">{evt.title}</h3>
                  {evt.notes && <p className="text-xs text-gray-400 font-sans leading-relaxed">{evt.notes}</p>}

                  {/* Pre-Checklist triggers */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <strong className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1">
                      <ListTodo className="h-3.5 w-3.5" />
                      Pre-Publish Quality Checklists
                    </strong>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => toggleChecklist(evt.id!, 'hookChecked')}
                        className={`text-[10px] py-1 px-2.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          evt.checklist.hookChecked 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-bold' 
                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                        Hook Approved
                      </button>

                      <button
                        onClick={() => toggleChecklist(evt.id!, 'seoChecked')}
                        className={`text-[10px] py-1 px-2.5 rounded-lg border hover:bg-white/10 flex items-center gap-1.5 transition-all ${
                          evt.checklist.seoChecked 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-bold' 
                            : 'bg-white/5 text-gray-400 border-white/5'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                        SEO Optimizations Ready
                      </button>

                      <button
                        onClick={() => toggleChecklist(evt.id!, 'thumbnailChecked')}
                        className={`text-[10px] py-1 px-2.5 rounded-lg border flex items-center gap-1.5 hover:bg-white/10 transition-all ${
                          evt.checklist.thumbnailChecked 
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-bold' 
                            : 'bg-white/5 text-gray-400 border-white/5'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                        Thumbnail Checked
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side operational status selectors */}
                <div className="flex md:flex-col gap-2 shrink-0 md:w-36 text-xs font-sans">
                  <select 
                    value={evt.status}
                    onChange={e => changeStatus(evt.id!, e.target.value as any)}
                    className="w-full bg-[#121217] text-white border border-white/10 rounded-lg p-2 focus:outline-none"
                  >
                    <option value="draft">Draft Mode</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="uploaded">Published</option>
                  </select>

                  <button 
                    onClick={() => handleDelete(evt.id!)}
                    className="w-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-white/10 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors text-xs"
                  >
                    <Trash className="h-3.5 w-3.5" />
                    Delete event
                  </button>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="rounded-xl border border-white/5 border-dashed p-10 text-center space-y-2">
              <HelpCircle className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-gray-300">Your release list is empty.</h4>
              <p className="text-xs text-gray-400">Map your channel releases using the scheduling portal on the left panel.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
