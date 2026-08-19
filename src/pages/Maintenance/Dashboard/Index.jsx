import React, { useState } from 'react';
import styles from './Index.module.css';

// SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const WrenchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
  </svg>
);

const ChecklistIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 18h.01"></path>
    <path d="M12 18h.01"></path>
    <path d="M16 18h.01"></path>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="12" y1="2" x2="12" y2="9"></line>
    <line x1="12" y1="15" x2="12" y2="22"></line>
  </svg>
);

const getIconByName = (name) => {
  switch (name) {
    case 'Wrench': return <WrenchIcon />;
    case 'Box': return <BoxIcon />;
    case 'Lightbulb': return <LightbulbIcon />;
    case 'Checklist': return <ChecklistIcon />;
    default: return <WrenchIcon />;
  }
};

export default function MaintenanceDashboardPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      icon: 'Wrench',
      name: 'Leaking faucet in Penthouse 502',
      meta: 'Reported 12m ago • By Housekeeping (Sarah J.)',
      status: 'PENDING',
      priority: 'High'
    },
    {
      id: 2,
      icon: 'Box',
      name: 'AC unit making noise - Room 204',
      meta: 'Reported 45m ago • By Guest Request',
      status: 'PENDING',
      priority: 'Normal'
    },
    {
      id: 3,
      icon: 'Lightbulb',
      name: 'Replace hallway lights - Floor 4',
      meta: 'Reported 2h ago • Routine Check',
      status: 'COMPLETED',
      priority: 'Normal'
    },
    {
      id: 4,
      icon: 'Checklist',
      name: 'Monthly fire extinguisher check',
      meta: 'Due Today • Compliance',
      status: 'PENDING',
      priority: 'High'
    }
  ]);

  const [activeTaskTab, setActiveTaskTab] = useState('All');
  
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'LED Bulbs E27', count: 2, icon: 'MapPin' },
    { id: 2, name: 'Air Filters', count: 5, icon: 'Filter' }
  ]);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [newInvName, setNewInvName] = useState('');
  const [newInvCount, setNewInvCount] = useState('');

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Generate 7 days for the week based on offset
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay() || 7; // Convert Sunday (0) to 7
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + 1);

  const startOfViewWeek = new Date(startOfCurrentWeek);
  startOfViewWeek.setDate(startOfCurrentWeek.getDate() + currentWeekOffset * 7);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfViewWeek);
    d.setDate(startOfViewWeek.getDate() + i);
    return {
      name: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()],
      date: d.getDate(),
      fullDate: d,
    };
  });

  // Mock Agenda Data based on selected date
  const getAgendaForDay = (fullDate) => {
    const agendas = [];
    const dateNum = fullDate.getDate();
    if (dateNum % 2 === 0) agendas.push({ time: '09:00', desc: 'Pool Filtration System Flush' });
    if (dateNum % 3 === 0) agendas.push({ time: '14:00', desc: 'Fire Alarm Quarterly Testing' });
    if (dateNum % 5 === 0) agendas.push({ time: '11:30', desc: 'HVAC Maintenance' });
    if (agendas.length === 0) agendas.push({ time: '10:00', desc: 'Routine Property Walkthrough' });
    return agendas;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newReporter, setNewReporter] = useState('');

  // Edit task state
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editReporter, setEditReporter] = useState('');
  const [editStatus, setEditStatus] = useState('PENDING');
  const [editPriority, setEditPriority] = useState('Normal');

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setEditTaskName(task.name);
    // Parse reporter from meta string: "Reported X ago • By REPORTER"
    const byMatch = task.meta.match(/By (.+)$/);
    setEditReporter(byMatch ? byMatch[1] : '');
    setEditStatus(task.status);
    setEditPriority(task.priority);
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    if (!editTaskName.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              name: editTaskName.trim(),
              meta: editReporter.trim()
                ? `${t.meta.split(' •')[0]} • By ${editReporter.trim()}`
                : t.meta,
              status: editStatus,
              priority: editPriority,
            }
          : t
      )
    );
    setEditingTask(null);
  };

  const handleUndoTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'PENDING' } : t))
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName || !newReporter) return;

    const newTask = {
      id: Date.now(),
      icon: 'Wrench',
      name: newTaskName,
      meta: `Reported just now • By ${newReporter}`,
      status: 'PENDING',
      priority: 'Normal'
    };

    setTasks([newTask, ...tasks]);
    setNewTaskName('');
    setNewReporter('');
    setIsModalOpen(false);
  };

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!newInvName || !newInvCount) return;

    const newItem = {
      id: Date.now(),
      name: newInvName,
      count: parseInt(newInvCount) || 0,
      icon: 'Box' // Default icon for new items
    };

    setInventoryItems([...inventoryItems, newItem]);
    setNewInvName('');
    setNewInvCount('');
    setIsInventoryModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTaskTab === 'High Priority') return task.priority === 'High';
    return true; // All
  });

  return (
    <div className={styles.page}>
      {/* Add Task Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Task Name</label>
                <input 
                  type="text" 
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className={styles.input} 
                  placeholder="e.g. Broken AC in Room 101" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reported By</label>
                <input 
                  type="text" 
                  value={newReporter}
                  onChange={(e) => setNewReporter(e.target.value)}
                  className={styles.input} 
                  placeholder="e.g. Guest (John Doe) or Housekeeping" 
                  required 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Edit Task</h2>
            <form onSubmit={handleEditTask}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Task Name</label>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Broken AC in Room 101"
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Reported By</label>
                <input
                  type="text"
                  value={editReporter}
                  onChange={(e) => setEditReporter(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Guest (John Doe) or Housekeeping"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={styles.input}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className={styles.input}
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {isInventoryModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Add Inventory Item</h2>
            <form onSubmit={handleAddInventory}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Item Name</label>
                <input 
                  type="text" 
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  className={styles.input} 
                  placeholder="e.g. Paint Brushes" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Quantity Left</label>
                <input 
                  type="number" 
                  value={newInvCount}
                  onChange={(e) => setNewInvCount(e.target.value)}
                  className={styles.input} 
                  placeholder="e.g. 10" 
                  required 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsInventoryModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Maintenance</h1>
          <p className={styles.subtitle}>Track and resolve maintenance issues across the property.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <SearchIcon />
            <input type="text" placeholder="Quick find task..." className={styles.searchInput} />
          </div>
          <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
            + Add Task
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>OPEN REQUESTS</div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{tasks.filter(t => t.status === 'PENDING').length}</span>
            <span className={`${styles.kpiDelta} ${styles.redText}`}>↑ 12%</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>AVG. RESOLUTION</div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>3.2<span className={styles.kpiUnit}>h</span></span>
            <span className={`${styles.kpiDelta} ${styles.greenText}`}>↓ 8%</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>STAFF ONLINE</div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>12 <span className={styles.kpiSecondary}>/ 15</span></span>
          </div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpiSolid}`}>
          <div className={styles.kpiLabelSolid}>COMPLIANCE RATE</div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValueSolid}>98%</span>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className={styles.taskListCard}>
        <div className={styles.taskListHeader}>
          <div className={styles.taskListTitleWrapper}>
            <div className={styles.indicator}></div>
            <h2 className={styles.sectionTitle}>Active & Pending Issues</h2>
          </div>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTaskTab === 'All' ? styles.tabActive : ''}`}
              onClick={() => setActiveTaskTab('All')}
            >
              All Tasks
            </button>
            <button 
              className={`${styles.tab} ${activeTaskTab === 'High Priority' ? styles.tabActive : ''}`}
              onClick={() => setActiveTaskTab('High Priority')}
            >
              High Priority
            </button>
          </div>
        </div>

        <div className={styles.taskList}>
          {filteredTasks.map(task => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskMain}>
                <div className={styles.taskIcon}>{getIconByName(task.icon)}</div>
                <div>
                  <div className={styles.taskName}>{task.name}</div>
                  <div className={styles.taskMeta}>{task.meta}</div>
                </div>
              </div>
              <div className={styles.taskStatus}>
                <span className={`${styles.badge} ${task.status === 'PENDING' ? styles.badgePending : styles.badgeCompleted}`}>
                  {task.status}
                </span>
                {task.status === 'COMPLETED' && <button className={styles.undoBtn} onClick={() => handleUndoTask(task.id)}>Undo</button>}
                <button
                  className={styles.undoBtn}
                  onClick={() => handleOpenEdit(task)}
                  aria-label={`Edit task: ${task.name}`}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.historyLinkWrapper}>
          <a href="#" className={styles.historyLink}>View All 156 History Records</a>
        </div>
      </div>

      {/* Grid Bottom Section */}
      <div className={styles.bottomGrid}>
        {/* Critical Inventory */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Critical Inventory</h2>
            <WarningIcon />
          </div>
          <div className={styles.inventoryList}>
            {inventoryItems.map(item => (
              <div key={item.id} className={styles.inventoryItem}>
                <div className={styles.inventoryLabel}>
                  <div className={styles.invIcon}>{item.icon === 'MapPin' ? <MapPinIcon /> : item.icon === 'Filter' ? <FilterIcon /> : <BoxIcon />}</div>
                  <span>{item.name}</span>
                </div>
                <div className={styles.inventoryStatusRed}>{item.count} Left</div>
              </div>
            ))}
          </div>
          <button className={styles.outlineButtonFull} onClick={() => setIsInventoryModalOpen(true)}>Manage Inventory</button>
        </div>

        {/* Weekly Overview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Weekly Overview</h2>
            <div className={styles.navArrows}>
              <span className={styles.arrow} onClick={() => setCurrentWeekOffset(prev => prev - 1)} style={{ cursor: 'pointer' }}>{'<'}</span>
              <span className={styles.arrow} onClick={() => setCurrentWeekOffset(prev => prev + 1)} style={{ cursor: 'pointer' }}>{'>'}</span>
            </div>
          </div>
          <div className={styles.calendarWeek}>
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className={`${styles.dayCol} ${index === selectedDayIndex ? styles.dayActive : ''}`}
                onClick={() => setSelectedDayIndex(index)}
                style={{ cursor: 'pointer' }}
              >
                <span className={styles.dayName}>{day.name}</span>
                <span className={styles.dayNum}>{day.date}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.agendaList}>
            {getAgendaForDay(weekDays[selectedDayIndex].fullDate).map((agenda, i) => (
              <div key={i} className={styles.agendaItem}>
                <div className={styles.agendaTime}>{agenda.time}</div>
                <div className={styles.agendaDesc}>{agenda.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
