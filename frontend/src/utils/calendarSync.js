/**
 * Utility to generate and download RFC 5545 compliant iCalendar (.ics) files
 * compatible with Google Calendar, Microsoft Outlook, Apple Calendar, and Thunderbird.
 */

function formatDateToICS(dateStr, isAllDay = true) {
  if (!dateStr) return '';
  // Convert YYYY-MM-DD into YYYYMMDD
  const clean = dateStr.replace(/-/g, '');
  if (isAllDay) {
    return clean;
  }
  return clean + 'T090000Z';
}

function getUID(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}@securetenant.io`;
}

/**
 * Generates an .ics file from an array of company holidays and triggers a browser download.
 */
export function exportHolidaysToICS(holidays = [], orgName = 'SecureTenant Enterprise') {
  if (!holidays || holidays.length === 0) {
    alert('No holidays available to export.');
    return;
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SecureTenant Systems//Workplace Holiday Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${orgName} - Official Holidays`,
    'X-WR-TIMEZONE:UTC',
  ];

  holidays.forEach((h) => {
    const dt = formatDateToICS(h.date, true);
    // Next day for end date in all-day event
    const nextDate = new Date(h.date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dtEnd = formatDateToICS(nextDate.toISOString().split('T')[0], true);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${getUID('hol')}`,
      `DTSTAMP:${formatDateToICS(new Date().toISOString().split('T')[0], true)}T000000Z`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:🎉 Holiday: ${h.name}`,
      `DESCRIPTION:${h.description || h.type || 'Official Company Holiday'} (${h.department || 'All Departments'})`,
      `LOCATION:${orgName}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  const icsContent = lines.join('\r\n');

  downloadICSFile(icsContent, `${orgName.replace(/\s+/g, '_')}_Holidays.ics`);
}

/**
 * Generates an .ics file from approved employee leaves.
 */
export function exportLeavesToICS(leaves = [], employeeName = 'Employee') {
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved');
  if (approvedLeaves.length === 0) {
    alert('No approved leaves found to export. Only approved leaves can be added to your calendar.');
    return;
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SecureTenant Systems//Employee Approved Leaves//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${employeeName} - Approved Leaves`,
    'X-WR-TIMEZONE:UTC',
  ];

  approvedLeaves.forEach((l) => {
    const dtStart = formatDateToICS(l.startDate, true);
    // Add 1 day to end date for full-day event boundary
    const nextDate = new Date(l.endDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const dtEnd = formatDateToICS(nextDate.toISOString().split('T')[0], true);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${getUID('leave')}`,
      `DTSTAMP:${formatDateToICS(new Date().toISOString().split('T')[0], true)}T000000Z`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:🌴 Out of Office: ${l.leaveType} Leave (${employeeName})`,
      `DESCRIPTION:Approved ${l.leaveType} Leave (${l.daysCount} days). Reason: ${l.reason || 'None specified'}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  const icsContent = lines.join('\r\n');

  downloadICSFile(icsContent, `${employeeName.replace(/\s+/g, '_')}_Approved_Leaves.ics`);
}

function downloadICSFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

