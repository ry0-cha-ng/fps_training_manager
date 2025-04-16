import { TrainingMenu, TrainingMenuItem } from '../types';

export const convertMenuToCSV = (menu: TrainingMenu): string => {
  const header = 'id,title,description,itemId,itemName,itemDescription,durationInSeconds\n';
  const rows = menu.items.map(item => 
    `${menu.id},${escapeCSV(menu.title)},${escapeCSV(menu.description)},${item.id},${escapeCSV(item.name)},${escapeCSV(item.description)},${item.durationInSeconds}`
  ).join('\n');
  return header + rows;
};

export const convertCSVToMenu = (csv: string): TrainingMenu => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('Invalid CSV format');
  }

  const [header, ...rows] = lines;
  if (!isValidHeader(header)) {
    throw new Error('Invalid CSV header');
  }

  const firstRow = parseCSVRow(rows[0]);
  const menu: TrainingMenu = {
    id: firstRow[0],
    title: firstRow[1],
    description: firstRow[2],
    items: []
  };

  rows.forEach(row => {
    const [, , , itemId, itemName, itemDescription, durationInSeconds] = parseCSVRow(row);
    menu.items.push({
      id: itemId,
      name: itemName,
      description: itemDescription,
      durationInSeconds: parseInt(durationInSeconds)
    });
  });

  return menu;
};

const escapeCSV = (str: string): string => {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  result.push(currentValue);
  return result;
};

const isValidHeader = (header: string): boolean => {
  const expectedHeader = 'id,title,description,itemId,itemName,itemDescription,durationInSeconds';
  return header.trim() === expectedHeader;
}; 