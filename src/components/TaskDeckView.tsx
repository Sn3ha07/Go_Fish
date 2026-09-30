import React, { useState } from 'react';
import { Task, ImportanceLevel, TaskCategory, PrioritizationSettings, SubTask } from '../types';
import { getFishForTask } from '../data/fishCatalog';
import { PixelFish } from './PixelFish';
import { Search, CheckCircle, Circle, MoreVertical, Edit3, Trash2, Play, Clock, X, Calendar, Plus, ListOrdered } from 'lucide-react';
import { playTaskComplete, playReelClick } from '../utils/audio';

interface TaskDeckViewProps {
  tasks: Task[];
  prioritization: PrioritizationSettings;
  soundEnabled: boolean;
  isAddingTask?: boolean;
  onCloseAddingTask?: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'caughtCount'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onFocusTask: (task: Task) => void;
  onOpenSettings: () => void;
}

export const TaskDeckView: React.FC<TaskDeckViewProps> = ({
  tasks,
  soundEnabled,
  isAddingTask = false,
  onCloseAddingTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onFocusTask
}) => {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');

  // Sync external add trigger from Navbar
  React.useEffect(() => {
    if (isAddingTask) {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        estimatedMinutes: 20,
        importance: 'medium',
        category: 'work',
        subtasks: []
      });
      setEditingTask(null);
      setIsModalOpen(true);
    }
  }, [isAddingTask]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewSubtaskTitle('');
    if (onCloseAddingTask) onCloseAddingTask();
  };

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedMinutes: 20,
    importance: 'medium' as ImportanceLevel,
    category: 'work' as TaskCategory,
    subtasks: [] as SubTask[]
  });

  const categories: TaskCategory[] = ['work', 'personal', 'study', 'health', 'creative', 'home'];

  const displayedTasks = tasks.filter(t => {
    if (showCompleted ? !t.completed : t.completed) return false;
    if (filterCat !== 'all' && t.category !== filterCat) return false;
    if (search.trim() && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      estimatedMinutes: task.estimatedMinutes,
      importance: task.importance,
      category: task.category,
      subtasks: task.subtasks ? [...task.subtasks] : []
    });
    setEditingTask(task);
    setActiveMenuTaskId(null);
    setIsModalOpen(true);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newStep: SubTask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newStep]
    }));
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate || undefined,
        estimatedMinutes: Number(form.estimatedMinutes),
        importance: form.importance,
        category: form.category,
        subtasks: form.subtasks.length > 0 ? form.subtasks : undefined
      });
    } else {
      onAddTask({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate || undefined,
        estimatedMinutes: Number(form.estimatedMinutes),
        importance: form.importance,
        category: form.category,
        completed: false,
        subtasks: form.subtasks.length > 0 ? form.subtasks : undefined
      });
    }

    handleCloseModal();
  };

  const handleToggleCheck = (task: Task) => {
    if (!task.completed) {
      playTaskComplete(soundEnabled);
    } else {
      playReelClick(soundEnabled);
    }
    onUpdateTask({
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined
    });
  };

  return (
    <div className="space-y-2.5 max-w-2xl mx-auto select-none p-1 sm:p-2">
      
      {/* Streamlined Search & Filter Controls */}
      <div className="gb-window p-2.5 space-y-2 rounded-xl shadow-sm">
        
        {/* Search input + Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 bg-[#0c141d] border border-[#2b3e54] rounded-lg text-xs font-sans text-[#e2edf8] placeholder-stone-500 focus:outline-none focus:border-[#f8b800] transition-colors"
            />
          </div>

          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-8 px-2 bg-[#0c141d] border border-[#2b3e54] rounded-lg text-xs font-sans font-semibold text-[#f8b800] capitalize focus:outline-none focus:border-[#f8b800] shrink-0"
          >
            <option value="all">All</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tab Switch: Active vs Done */}
        <div className="flex p-0.5 bg-[#0c141d] border border-[#2b3e54] rounded-lg text-xs">
          <button
            onClick={() => setShowCompleted(false)}
            className={`flex-1 py-1 rounded-md transition-colors text-center font-sans font-bold text-xs ${
              !showCompleted ? 'bg-[#22354a] text-[#f8b800] border border-[#f8b800]/40' : 'text-stone-400 hover:text-white'
            }`}
          >
            Active Tasks ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`flex-1 py-1 rounded-md transition-colors text-center font-sans font-bold text-xs ${
              showCompleted ? 'bg-[#22354a] text-[#f8b800] border border-[#f8b800]/40' : 'text-stone-400 hover:text-white'
            }`}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>
      </div>

      {/* Task List (Clean rows, distinct click targets, clear font hierarchy) */}
      <div className="space-y-1.5 pb-2">
        {displayedTasks.length === 0 ? (
          <div className="gb-window p-6 text-center rounded-xl space-y-1">
            <p className="font-pixel text-[9px] text-[#f8b800]">
              {showCompleted ? "NO COMPLETED TASKS" : "POND BASIN IS EMPTY"}
            </p>
            <p className="text-xs text-stone-400 font-sans">
              {showCompleted ? "Complete a focus session to fill this log." : "Tap '+ NEW' above to hook your first task!"}
            </p>
          </div>
        ) : (
          displayedTasks.map((task) => {
            const fish = getFishForTask(task);
            const isMenuOpen = activeMenuTaskId === task.id;
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasksCount = hasSubtasks ? task.subtasks!.filter(st => st.completed).length : 0;

            return (
              <div
                key={task.id}
                className="relative gb-window p-2.5 flex items-center justify-between gap-2.5 rounded-xl transition-all hover:border-[#f8b800]/80"
              >
                {/* Left: Complete Checkbox */}
                <button
                  onClick={() => handleToggleCheck(task)}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-[#78d8a0] transition-colors shrink-0 rounded-lg focus-visible:outline-none"
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-[#78d8a0] stroke-[2.2]" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-400 stroke-[2]" />
                  )}
                </button>

                {/* Center: Fish Sprite + Clear Hierarchical Task Details */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#0b1219] border border-[#2b3e54] flex items-center justify-center shrink-0">
                    <PixelFish type={fish.type} size="sm" animated={false} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold font-sans truncate ${task.completed ? 'line-through text-stone-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {hasSubtasks && (
                        <span className="px-1.5 py-0.2 rounded bg-[#2ec4b6]/20 text-[#2ec4b6] font-pixel text-[7.5px] uppercase shrink-0">
                          {completedSubtasksCount}/{task.subtasks!.length} ACTIONS
                        </span>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans text-stone-400 mt-0.5 truncate">
                      <span className="capitalize text-[#78d8a0] font-semibold shrink-0">{task.category}</span>
                      <span className="shrink-0">·</span>
                      <span className="flex items-center gap-0.5 text-[#f8b800] font-medium shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {task.estimatedMinutes}m
                      </span>
                      <span className="shrink-0">·</span>
                      <span className="capitalize shrink-0">{task.importance}</span>
                      {task.dueDate && (
                        <>
                          <span className="shrink-0">·</span>
                          <span className="text-amber-300 flex items-center gap-0.5 shrink-0">
                            <Calendar className="w-2.5 h-2.5" />
                            {task.dueDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Explicit Start/Focus Button & More Menu */}
                <div className="flex items-center gap-1.5 shrink-0 relative">
                  {!task.completed && (
                    <button
                      onClick={() => onFocusTask(task)}
                      className="gb-button min-h-[30px] px-2.5 py-1 text-[10px] font-pixel text-stone-200 rounded-lg flex items-center gap-1 cursor-pointer"
                      title="Start Focus Session"
                    >
                      <Play className="w-2.5 h-2.5 fill-current text-[#f8b800]" />
                      <span>START</span>
                    </button>
                  )}

                  {/* Dropdown Menu Toggle */}
                  <button
                    onClick={() => setActiveMenuTaskId(isMenuOpen ? null : task.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isMenuOpen ? 'bg-[#f8b800] text-[#0b1219]' : 'text-stone-400 hover:text-white hover:bg-[#1f2f42]'
                    }`}
                    title="Task options"
                    aria-label="Task options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveMenuTaskId(null)} 
                      />
                      <div className="absolute right-0 top-full mt-1 w-32 gb-window rounded-xl shadow-2xl py-1 z-50 animate-pop text-left">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="w-full px-3 py-1.5 text-xs text-stone-200 hover:text-[#f8b800] hover:bg-[#1a2b3d] flex items-center gap-2 transition-colors font-sans font-semibold"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#f8b800]" />
                          <span>Edit Task</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onDeleteTask(task.id);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:bg-[#2b1820] flex items-center gap-2 transition-colors font-sans font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete Task</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / New Task In-Screen Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-30 bg-[#0c141d]/95 gb-window flex flex-col justify-between p-4 overflow-y-auto animate-pop select-none">
          <div className="flex items-center justify-between border-b-2 border-[#2b3e54] pb-2">
            <h3 className="font-pixel text-[10px] text-[#f8b800] tracking-wider">
              {editingTask ? '▶ EDIT TASK' : '▶ NEW TASK'}
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-2.5 my-auto py-2">
            <div>
              <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">
                Task Title *
              </label>
              <input
                type="text"
                required
                placeholder="What task needs to be reeled in?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-8.5 px-3 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white focus:outline-none focus:border-[#f8b800]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full h-8 px-2 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white capitalize"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">Duration</label>
                <select
                  value={form.estimatedMinutes}
                  onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })}
                  className="w-full h-8 px-2 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white"
                >
                  <option value={5}>5 mins</option>
                  <option value={15}>15 mins</option>
                  <option value={25}>25 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">Priority</label>
                <select
                  value={form.importance}
                  onChange={(e) => setForm({ ...form, importance: e.target.value as any })}
                  className="w-full h-8 px-2 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Action Steps Section (Boba the Jellyfish's domain) */}
            <div className="p-2 rounded-lg bg-[#080d13] border border-[#2b3e54] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#2ec4b6] flex items-center gap-1 font-sans">
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Action Steps (Boba the Jelly)</span>
                </label>
                <span className="text-[8px] font-pixel text-stone-400">
                  {form.subtasks.length} {form.subtasks.length === 1 ? 'STEP' : 'STEPS'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add a step (e.g. Draft outline)..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 h-7.5 px-2 bg-[#0c141d] border border-[#2b3e54] rounded text-xs font-sans text-white focus:outline-none focus:border-[#2ec4b6]"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="gb-button h-7.5 px-2 text-[10px] font-pixel text-[#2ec4b6] rounded flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>ADD</span>
                </button>
              </div>

              {form.subtasks.length > 0 && (
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {form.subtasks.map((st, idx) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-[#0f1822] border border-[#1e2d3e] text-xs font-sans text-stone-200"
                    >
                      <span className="truncate">{idx + 1}. {st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="text-stone-500 hover:text-rose-400 p-0.5 shrink-0"
                        title="Remove step"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">Due Date (Optional)</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-8 px-2 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-200 block mb-1 font-sans">Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Details, links or context..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 bg-[#080d13] border-2 border-[#2b3e54] rounded-lg text-xs font-sans text-white focus:outline-none focus:border-[#f8b800] resize-none"
              />
            </div>

            <div className="pt-1.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="gb-button h-8 px-4 text-xs font-sans font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gb-button-primary h-8 px-4 text-xs font-pixel rounded-lg transition-colors"
              >
                SAVE TASK
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
