import React, { useState } from 'react';
import styles from './Index.module.css';

const attendanceSummary = [
    {
        id: 'present',
        label: 'PRESENT',
        value: '42',
        icon: '👤',
        variant: 'present',
    },
    {
        id: 'double',
        label: 'DOUBLE',
        value: '08',
        icon: '👥',
        variant: 'double',
    },
    {
        id: 'leave',
        label: 'LEAVE',
        value: '03',
        icon: '🛏',
        variant: 'leave',
    },
    {
        id: 'absent',
        label: 'ABSENT',
        value: '02',
        icon: '🔕',
        variant: 'absent',
    },
    {
        id: 'unmarked',
        label: 'UNMARKED',
        value: '05',
        icon: '?',
        variant: 'unmarked',
    },
];

const staffFilters = [
    'All Staff',
    'Managers',
    'Waiters',
    'Reception',
    'Kitchen',
    'Housekeeping',
];

const INITIAL_MANAGERS = [
    {
        id: 'emp-201',
        name: 'Eleanor Vance',
        role: 'SHIFT SUPERVISOR',
        salary: '$4,850 / month',
        status: 'Present',
        marked: false,
    },
    {
        id: 'emp-202',
        name: 'David Chen',
        role: 'F&B DIRECTOR',
        salary: '$7,200 / month',
        status: 'Present',
        marked: true,
    },
    {
        id: 'emp-203',
        name: 'Marcus Thorne',
        role: 'GUEST RELATIONS',
        salary: '$5,100 / month',
        status: 'Leave',
        marked: false,
    },
];

const INITIAL_WAITERS = [
    {
        id: 'emp-204',
        name: 'Sara Lopez',
        role: 'SERVER LEVEL II',
        salary: '$2,900 / month',
        status: 'Present',
        marked: false,
        initials: 'SL',
    },
    {
        id: 'emp-205',
        name: 'Julian Rossi',
        role: 'BANQUETS SPECIALIST',
        salary: '$3,150 / month',
        status: 'Present',
        marked: false,
    },
    {
        id: 'emp-206',
        name: 'Maya Patel',
        role: 'COCKTAIL SERVER',
        salary: '$3,400 / month',
        status: 'Present',
        marked: false,
    },
];

const INITIAL_RECEPTION = [
    {
        id: 'emp-207',
        name: 'Clara Oswald',
        role: 'FRONT DESK AGENT',
        salary: '$3,800 / month',
        status: 'Present',
        marked: false,
    },
    {
        id: 'emp-208',
        name: 'James Bond',
        role: 'CONCIERGE LEAD',
        salary: '$4,200 / month',
        status: 'Present',
        marked: true,
    },
];

const INITIAL_KITCHEN = [
    {
        id: 'emp-209',
        name: 'Gordon Ramsay',
        role: 'EXECUTIVE CHEF',
        salary: '$8,500 / month',
        status: 'Present',
        marked: true,
    },
    {
        id: 'emp-210',
        name: 'Remy Rat',
        role: 'SOUS CHEF',
        salary: '$4,600 / month',
        status: 'Present',
        marked: false,
    },
];

const INITIAL_HOUSEKEEPING = [
    {
        id: 'emp-211',
        name: 'Sarah Johnson',
        role: 'HOUSEKEEPING LEAD',
        salary: '$3,500 / month',
        status: 'Present',
        marked: false,
    },
    {
        id: 'emp-212',
        name: 'Anita Roy',
        role: 'ROOM ATTENDANT',
        salary: '$2,800 / month',
        status: 'Present',
        marked: false,
    },
];

const getInitials = (name) => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

function StaffCard({ staff, onStatusChange }) {
    return (
        <div
            className={`${styles.staffCard} ${staff.marked ? styles.markedCard : ''
                }`}
        >
            <div className={styles.cardTop}>
                <div className={styles.avatar}>
                    {staff.initials || getInitials(staff.name)}
                </div>

                <div className={styles.staffInfo}>
                    <h3 className={styles.staffName}>{staff.name}</h3>
                    <p className={styles.staffRole}>{staff.role}</p>
                    <p className={styles.staffSalary}>{staff.salary}</p>
                </div>

                <button className={styles.moreButton} type="button" onClick={() => window.alert(`Options for ${staff.name}: Edit, View Profile`)}>
                    ⋮
                </button>

                {staff.marked && (
                    <span className={styles.markedBadge}>
                        MARKED
                    </span>
                )}
            </div>

            <div className={styles.statusActions}>
                <button
                    type="button"
                    className={`${styles.statusButton} ${styles.presentButton} ${staff.status === 'Present' ? styles.active : ''
                        }`}
                    onClick={() => onStatusChange(staff.id, 'Present')}
                >
                    Present
                </button>

                <button
                    type="button"
                    className={`${styles.statusButton} ${styles.doubleButton} ${staff.status === 'Double' ? styles.active : ''}`}
                    onClick={() => onStatusChange(staff.id, 'Double')}
                >
                    Double
                </button>

                <button
                    type="button"
                    className={`${styles.statusButton} ${styles.leaveButton} ${staff.status === 'Leave' ? styles.active : ''
                        }`}
                    onClick={() => onStatusChange(staff.id, 'Leave')}
                >
                    Leave
                </button>

                {staff.status === 'Leave' ? (
                    <button
                        type="button"
                        className={`${styles.statusButton} ${styles.absentButton} ${styles.active}`}
                        onClick={() => onStatusChange(staff.id, 'Absent')}
                    >
                        Absent
                    </button>
                ) : (
                    <button
                        type="button"
                        className={styles.helpButton}
                        aria-label="Unmarked"
                        onClick={() => onStatusChange(staff.id, 'Absent')}
                    >
                        ?
                    </button>
                )}

                {staff.marked && (
                    <button
                        type="button"
                        className={styles.checkButton}
                        aria-label="Marked"
                    >
                        ✓
                    </button>
                )}
            </div>
        </div>
    );
}

function StaffSection({ title, total, staff, onStatusChange, onSelectAll }) {
    return (
        <section className={styles.staffSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                    <span className={styles.sectionAccent}></span>

                    <h2 className={styles.sectionTitle}>{title}</h2>

                    <span className={styles.totalBadge}>
                        {total} Total
                    </span>
                </div>

                <button
                    type="button"
                    className={styles.selectAllButton}
                    onClick={() => onSelectAll(title)}
                >
                    Select All
                </button>
            </div>

            <div className={styles.staffGrid}>
                {staff.map((employee) => (
                    <StaffCard
                        key={employee.id}
                        staff={employee}
                        onStatusChange={onStatusChange}
                    />
                ))}
            </div>
        </section>
    );
}

export default function StaffAttendance() {
    const [activeFilter, setActiveFilter] = useState('All Staff');
    const [managers, setManagers] = useState(INITIAL_MANAGERS);
    const [waiters, setWaiters] = useState(INITIAL_WAITERS);
    const [reception, setReception] = useState(INITIAL_RECEPTION);
    const [kitchen, setKitchen] = useState(INITIAL_KITCHEN);
    const [housekeeping, setHousekeeping] = useState(INITIAL_HOUSEKEEPING);

    const handleStatusChange = (id, newStatus) => {
        const updateList = (prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...emp, status: newStatus, marked: true } : emp
            );
        setManagers(updateList);
        setWaiters(updateList);
        setReception(updateList);
        setKitchen(updateList);
        setHousekeeping(updateList);
    };

    const handleSelectAll = (sectionTitle) => {
        const markAll = (list) =>
            list.map((emp) => ({ ...emp, status: 'Present', marked: true }));
        if (sectionTitle === 'Managers') setManagers(markAll);
        if (sectionTitle === 'Waiters') setWaiters(markAll);
        if (sectionTitle === 'Reception') setReception(markAll);
        if (sectionTitle === 'Kitchen') setKitchen(markAll);
        if (sectionTitle === 'Housekeeping') setHousekeeping(markAll);
    };

    const handleExportPDF = () => window.print();

    const handleFloatingSubmit = () => {
        const allStaffList = [...managers, ...waiters, ...reception, ...kitchen, ...housekeeping];
        const allMarked = allStaffList.every((e) => e.marked);
        if (allMarked) {
            window.alert('All attendance marked and submitted successfully!');
        } else {
            window.alert('Attendance submitted. Note: some staff members are still unmarked.');
        }
    };

    const showAll = activeFilter === 'All Staff';

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Daily Attendance Management
                    </h1>

                    <p className={styles.subtitle}>
                        Track employee attendance and status across departments.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <label className={styles.dateControl}>
                        <span className={styles.calendarIcon}>▣</span>

                        <input
                            type="date"
                            defaultValue="2023-10-24"
                            aria-label="Attendance date"
                        />
                    </label>

                    <button
                        type="button"
                        className={styles.exportButton}
                        onClick={handleExportPDF}
                    >
                        ↓ &nbsp; Export PDF
                    </button>
                </div>
            </header>

            <nav className={styles.filterBar}>
                {staffFilters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`${styles.filterButton} ${activeFilter === filter ? styles.activeFilter : ''
                            }`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </nav>

            <section className={styles.summaryGrid}>
                {attendanceSummary.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.summaryCard} ${styles[item.variant]
                            }`}
                    >
                        <div className={styles.summaryIcon}>
                            {item.icon}
                        </div>

                        <div className={styles.summaryContent}>
                            <span className={styles.summaryLabel}>
                                {item.label}
                            </span>

                            <strong className={styles.summaryValue}>
                                {item.value}
                            </strong>
                        </div>
                    </div>
                ))}
            </section>

            {(showAll || activeFilter === 'Managers') && (
                <StaffSection
                    title="Managers"
                    total={managers.length}
                    staff={managers}
                    onStatusChange={handleStatusChange}
                    onSelectAll={handleSelectAll}
                />
            )}

            {(showAll || activeFilter === 'Waiters') && (
                <StaffSection
                    title="Waiters"
                    total={waiters.length}
                    staff={waiters}
                    onStatusChange={handleStatusChange}
                    onSelectAll={handleSelectAll}
                />
            )}

            {(showAll || activeFilter === 'Reception') && (
                <StaffSection
                    title="Reception"
                    total={reception.length}
                    staff={reception}
                    onStatusChange={handleStatusChange}
                    onSelectAll={handleSelectAll}
                />
            )}

            {(showAll || activeFilter === 'Kitchen') && (
                <StaffSection
                    title="Kitchen"
                    total={kitchen.length}
                    staff={kitchen}
                    onStatusChange={handleStatusChange}
                    onSelectAll={handleSelectAll}
                />
            )}

            {(showAll || activeFilter === 'Housekeeping') && (
                <StaffSection
                    title="Housekeeping"
                    total={housekeeping.length}
                    staff={housekeeping}
                    onStatusChange={handleStatusChange}
                    onSelectAll={handleSelectAll}
                />
            )}

            <button
                type="button"
                className={styles.floatingButton}
                aria-label="Attendance action"
                onClick={handleFloatingSubmit}
            >
                ✓
            </button>
        </div>
    );
}