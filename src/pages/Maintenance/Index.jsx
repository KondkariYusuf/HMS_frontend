import React, { useState } from 'react';
import styles from './Index.module.css';

const IconWrench = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 4.5C9.5 5.88071 8.38071 7 7 7C6.67104 7 6.35688 6.93665 6.07185 6.82276L2.35355 10.5411C2.15829 10.7363 2.15829 11.0529 2.35355 11.2482L4.25178 13.1464C4.44704 13.3417 4.76362 13.3417 4.95888 13.1464L8.67724 9.42815C8.79113 9.71318 8.85448 10.0273 8.85448 10.3556C8.85448 11.7363 7.73519 12.8556 6.35448 12.8556" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 2.5L10 6L9.5 4.5L8 4L11.5 0.5L13.5 2.5Z" fill="currentColor"/>
  </svg>
);

const IconAc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconBulb = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 21H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 5C8.134 5 5 8.134 5 12C5 14.153 6.359 16.037 8 17H16C17.641 16.037 19 14.153 19 12C19 8.134 15.866 5 12 5Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconElevator = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 2V22" stroke="currentColor" strokeWidth="2"/>
    <circle cx="8" cy="12" r="1" fill="currentColor"/>
    <circle cx="16" cy="12" r="1" fill="currentColor"/>
  </svg>
);

const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 16H20V20H4V16Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 19L12 3L2 19H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const initialTasks = [
  {
    id: 1,
    title: 'Leaking faucet in Penthouse 502',
    icon: <IconWrench />,
    time: 'Reported 12m ago',
    author: 'By Housekeeping (Sarah J.)',
    status: 'PENDING',
  },
  {
    id: 2,
    title: 'AC unit making noise - Room 204',
    icon: <IconAc />,
    time: 'Reported 45m ago',
    author: 'By Guest Request',
    status: 'PENDING',
  },
  {
    id: 3,
    title: 'Replace corridor lighting – Wing B',
    icon: <IconBulb />,
    time: 'Completed 2h ago',
    author: 'By Mike Ross',
    status: 'COMPLETED',
  },
  {
    id: 4,
    title: 'Service Elevator #2 inspection',
    icon: <IconElevator />,
    time: 'Scheduled for 2:00 PM',
    author: 'Routine Maintenance',
    status: 'PENDING',
  },
];

export default function MaintenanceDashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState('All Tasks');
  const [showToast, setShowToast] = useState(false);
  const [activeDay, setActiveDay] = useState(12);
  const [weekOffset, setWeekOffset] = useState(0);

  const handlePrevWeek = () => {
    setWeekOffset(prev => prev - 1);
    setActiveDay(12 + ((weekOffset - 1) * 7));
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
    setActiveDay(12 + ((weekOffset + 1) * 7));
  };

  const weekDays = [
    { name: 'MON', num: 12 },
    { name: 'TUE', num: 13 },
    { name: 'WED', num: 14 },
    { name: 'THU', num: 15 },
    { name: 'FRI', num: 16 },
    { name: 'SAT', num: 17 },
    { name: 'SUN', num: 18 },
  ];

  const agendaData = {
    12: [
      { id: 1, time: '09:00', title: 'Pool Filtration System Flush' },
      { id: 2, time: '14:00', title: 'Fire Alarm Quarterly Testing' },
    ],
    13: [
      { id: 3, time: '10:30', title: 'Elevator #2 Maintenance' },
    ],
    14: [
      { id: 4, time: '08:00', title: 'HVAC Filter Replacement' },
      { id: 5, time: '13:15', title: 'Guest Room Wi-Fi Check' },
      { id: 6, time: '16:00', title: 'Plumbing Inspection - Wing A' },
    ],
    15: [
      { id: 7, time: '11:00', title: 'Generator Test Run' },
    ],
    16: [
      { id: 8, time: '09:30', title: 'Landscaping - Front Yard' },
      { id: 9, time: '15:00', title: 'Pest Control Service' },
    ],
    17: [],
    18: [
      { id: 10, time: '12:00', title: 'Emergency Drill' },
    ],
  };

  const handleUndo = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'PENDING', time: 'Reported recently' } : t));
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Maintenance Request',
      icon: <IconWrench />,
      time: 'Reported just now',
      author: 'By User',
      status: 'PENDING'
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Maintenance</h1>
          <p className={styles.pageSubtitle}>Track and resolve maintenance issues across the property.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Quick find task..." className={styles.searchInput} />
          </div>
          <button className={styles.addButton} onClick={handleAddTask}>
            + Add Task
          </button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>OPEN REQUESTS</div>
          <div className={styles.kpiValueWrapper}>
            <span className={styles.kpiValue}>24</span>
            <span className={styles.kpiTrendUp}>&uarr; 12%</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>AVG. RESOLUTION</div>
          <div className={styles.kpiValueWrapper}>
            <span className={styles.kpiValue}>3.2</span>
            <span className={styles.kpiUnit}>h</span>
            <span className={styles.kpiTrendDown}>&darr; 8%</span>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>STAFF ONLINE</div>
          <div className={styles.kpiValueWrapper}>
            <span className={styles.kpiValue}>12</span>
            <span className={styles.kpiSub}>/ 15</span>
          </div>
        </div>
        <div className={styles.kpiCardDark}>
          <div className={styles.kpiLabelDark}>COMPLIANCE RATE</div>
          <div className={styles.kpiValueDark}>98%</div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWrapper}>
                <div className={styles.cardIndicator}></div>
                <h3 className={styles.cardTitle}>Active &amp; Pending Issues</h3>
              </div>
              <div className={styles.filterGroup}>
                <button 
                  className={`${styles.filterBtn} ${activeFilter === 'All Tasks' ? styles.filterActive : ''}`}
                  onClick={() => setActiveFilter('All Tasks')}
                >
                  All Tasks
                </button>
                <button 
                  className={`${styles.filterBtn} ${activeFilter === 'High Priority' ? styles.filterActive : ''}`}
                  onClick={() => setActiveFilter('High Priority')}
                >
                  High Priority
                </button>
              </div>
            </div>

            <div className={styles.taskList}>
              {tasks.filter(t => activeFilter === 'All Tasks' || t.status === 'PENDING').map(task => (
                <div className={styles.taskItem} key={task.id}>
                  <div className={styles.taskIconWrapper}>
                    {task.icon}
                  </div>
                  <div className={styles.taskDetails}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={styles.taskMeta}>
                      <span className={styles.taskMetaIcon}><IconClock /></span>
                      {task.time} <span className={styles.metaDot}>&bull;</span> {task.author}
                    </div>
                  </div>
                  <div className={styles.taskAction}>
                    <span className={`${styles.statusBadge} ${task.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending}`}>
                      {task.status}
                    </span>
                    {task.status === 'COMPLETED' && (
                      <button className={styles.undoBtn} onClick={() => handleUndo(task.id)}>Undo</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.viewAllWrapper}>
              <button className={styles.viewAllBtn}>View All 156 History Records</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Critical Inventory</h3>
              <span className={styles.warningIcon}><IconWarning /></span>
            </div>
            <div className={styles.inventoryList}>
              <div className={styles.inventoryItem}>
                <div className={styles.inventoryLeft}>
                  <div className={styles.inventoryIconWrapper}><IconBulb /></div>
                  <span className={styles.inventoryName}>LED Bulbs E27</span>
                </div>
                <div className={styles.inventoryRight}>2 Left</div>
              </div>
              <div className={styles.inventoryItem}>
                <div className={styles.inventoryLeft}>
                  <div className={styles.inventoryIconWrapper}><IconFilter /></div>
                  <span className={styles.inventoryName}>Air Filters</span>
                </div>
                <div className={styles.inventoryRight}>5 Left</div>
              </div>
            </div>
            <button className={styles.manageInventoryBtn}>Manage Inventory</button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Weekly Overview</h3>
              <div className={styles.arrowNav}>
                <button className={styles.arrowBtn} onClick={handlePrevWeek}>&lt;</button>
                <button className={styles.arrowBtn} onClick={handleNextWeek}>&gt;</button>
              </div>
            </div>
            
            <div className={styles.calendarStrip}>
              {weekDays.map((day) => {
                const currentDayNum = day.num + (weekOffset * 7);
                return (
                <div 
                  key={day.name}
                  className={`${styles.calDay} ${activeDay === currentDayNum ? styles.calActive : ''}`}
                  onClick={() => setActiveDay(currentDayNum)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.calDayName}>{day.name}</div>
                  <div className={styles.calDayNum}>{currentDayNum}</div>
                </div>
                );
              })}
            </div>

            <div className={styles.agendaList}>
              {agendaData[activeDay]?.length > 0 ? (
                agendaData[activeDay].map((item) => (
                  <div className={styles.agendaItem} key={item.id}>
                    <div className={styles.agendaTime}>{item.time}</div>
                    <div className={styles.agendaTitle}>{item.title}</div>
                  </div>
                ))
              ) : (
                <div className={styles.agendaItem}>
                  <div className={styles.agendaTitle} style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No maintenance scheduled</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={styles.toast}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Task successfully marked as pending.
        </div>
      )}
    </div>
  );
}
