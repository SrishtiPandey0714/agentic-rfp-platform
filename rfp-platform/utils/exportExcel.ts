import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param filename Name of the Excel file (without extension)
 */
export function exportToExcel(data: any[], filename: string = 'export') {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export multiple sheets to Excel file
 * @param sheets Object with sheet names as keys and data arrays as values
 * @param filename Name of the Excel file (without extension)
 */
export function exportMultipleSheets(
    sheets: Record<string, any[]>,
    filename: string = 'export'
) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add each sheet to the workbook
    Object.entries(sheets).forEach(([sheetName, data]) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}
