import xlsx from 'xlsx';

try {
    const workbook = xlsx.readFile('C:\\Users\\Thanuj\\OneDrive\\ドキュメント\\Book1 (1).xlsx');
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Get raw JSON rows
    const rows = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${rows.length} rows.`);
    if (rows.length > 0) {
        console.log("Columns:", Object.keys(rows[0]));
        console.log("First row preview:");
        console.log(JSON.stringify(rows[0], null, 2));
    }
} catch (err) {
    console.error("Error reading file:", err.message);
}
