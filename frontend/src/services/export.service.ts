import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Facility {
  id?: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  availableFrom: string;
  availableTo: string;
  status: string;
}

export const exportToExcel = (facilities: Facility[], fileName: string = 'facilities') => {
  if (!facilities || facilities.length === 0) {
    return;
  }

  const data = facilities.map(f => ({
    'ID': f.id || '-',
    'Name': f.name,
    'Type': f.type,
    'Capacity': f.capacity,
    'Location': f.location,
    'Available From': f.availableFrom || '-',
    'Available To': f.availableTo || '-',
    'Status': f.status
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Facilities');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
  
  // REMOVED: alert('Excel file downloaded successfully!');
};

export const exportToPDF = (facilities: Facility[], title: string = 'Facilities Report') => {
  if (!facilities || facilities.length === 0) {
    return;
  }

  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date();
  const dateStr = `Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;
  doc.text(dateStr, 14, 30);
  
  const tableData = facilities.map(f => [
    f.id?.substring(0, 12) + '...' || '-',
    f.name,
    f.type,
    f.capacity?.toString() || '-',
    f.location,
    f.availableFrom || '-',
    f.availableTo || '-',
    f.status
  ]);
  
  autoTable(doc, {
    head: [['ID', 'Name', 'Type', 'Capacity', 'Location', 'From', 'To', 'Status']],
    body: tableData,
    startY: 35,
    theme: 'striped',
    headStyles: {
      fillColor: [26, 95, 122],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { top: 35, left: 14, right: 14 }
  });
  
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    doc.text('Smart Campus Operations Hub', 14, doc.internal.pageSize.getHeight() - 10);
  }
  
  doc.save('facilities_report.pdf');
  
  // REMOVED: alert('PDF file downloaded successfully!');
};