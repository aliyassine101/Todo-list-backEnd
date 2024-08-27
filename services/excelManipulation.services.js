const ExcelJS = require('exceljs');
const fs = require('fs');
const prompt = require('prompt-sync')();
const filePath = 'todolist.xlsx';
const workbook = new ExcelJS.Workbook();


async function readDataFromExcelFile(filePath) {
    // Load the existing file or create a new one
    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath)
        const worksheet = workbook.getWorksheet('Person');
        const result = sheetToJson(worksheet);
        return result;
    }

}


function sheetToJson(worksheet) {
    excelData = []
    worksheet.eachRow((row, rowNumber) => {
        // rowNumber 0 is empty
        if (rowNumber > 0) {
            // get values from row
            let rowValues = row.values;
            // remove first element (extra without reason)
            rowValues.shift();

            if (rowNumber === 1) excelTitles = rowValues;
            // table data
            else {
                // create object with the titles and the row values (if any)
                let rowObject = {}
                for (let i = 0; i < excelTitles.length; i++) {
                    // console.log('title:'+excelTitles)
                    let title = excelTitles[i];
                    let value = rowValues[i] ? rowValues[i] : '';
                    rowObject[title] = value;
                    // console.log('rowObject:',rowObject[title])
                }
                excelData.push(rowObject);
            }
        }
        else console.log("errorrrrrrrrrrrrr")
    })
    return excelData;
}



async function writetoExcel(itemm, priorityy) {
    // Load the existing file or create a new one
    if (fs.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
    }

    // Get or create the worksheet
    let worksheet = workbook.getWorksheet('Person');
    if (!worksheet) {
        worksheet = workbook.addWorksheet('Person');
        worksheet.columns = [
            { header: 'Item', key: 'item', width: 20 },
            { header: 'Priority', key: 'priority', width: 20 },
           
        ];
    }

    // Collect and add new data
    worksheet.columns = [
        { header: 'Item', key: 'item', width: 20 },
        { header: 'Priority', key: 'priority', width: 20 },
    ];
    const item =itemm;
    const priority = priorityy;
   

    // Append new row to the worksheet
    worksheet.addRow({ item: item, priority: priority });

    // Save the updated workbook
    await workbook.xlsx.writeFile(filePath);
    console.log("Excel file 'list.xlsx' updated with new data.");
}

async function removeRowById(filePath, idColumnName, idToRemove) {
    const workbook = new ExcelJS.Workbook();

    try {
        if (fs.existsSync(filePath)) {
            await workbook.xlsx.readFile(filePath);
        } else {
            console.log("File does not exist.");
            return;
        }

        const sheet = workbook.getWorksheet('Person');
        if (!sheet) {
            console.log(`Sheet 'Person' not found.`);
            return;
        }

        // Find the index of the column with the specified name
        let idColumnIndex = -1;
        sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (cell.value === idColumnName) {
                idColumnIndex = colNumber;
            }
        });

        if (idColumnIndex === -1) {
            console.log(`Column ${idColumnName} not found.`);
            return `Column ${idColumnName} not found.`;
        }

        let rowToRemove = null;
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (row.getCell(idColumnIndex).value === idToRemove) {
                rowToRemove = rowNumber;
            }
        });

        if (rowToRemove) {
            sheet.spliceRows(rowToRemove, 1); // Remove the row
            console.log(`Row with ID ${idToRemove} removed successfully.`);
            await workbook.xlsx.writeFile(filePath);

            return `Row with ID ${idToRemove} removed successfully.`;
        } else {
            console.log(`Row with ID ${idToRemove} not found.`);
            return `Row with ID ${idToRemove} not found.`
        }
    } catch (error) {
        console.error("An error occurred while processing the file:", error);
        return "An error occurred while processing the file:"
    }

}
async function updateNameById(filePath, idColumnName, idToUpdate, newFirstName, newLastName) {
    const workbook = new ExcelJS.Workbook();

    try {
        // Read the file
        if (fs.existsSync(filePath)) {
            await workbook.xlsx.readFile(filePath);
        } else {
            console.log("File does not exist.");
            return "File does not exist.";
        }

        // Get the worksheet
        const sheet = workbook.getWorksheet('Person');
        if (!sheet) {
            console.log(`Sheet 'Person' does not exist.`);
            return `Sheet 'Person' does not exist.`;
        }

        // Find the ID column index
        let idColumnIndex = -1;
        sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (cell.value === idColumnName) {
                idColumnIndex = colNumber;
            }
        });

        if (idColumnIndex === -1) {
            console.log(`Column ${idColumnName} not found.`);
            return `Column ${idColumnName} not found.`;
        }

        // Find the row to update
        let rowToUpdate = null;
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (row.getCell(idColumnIndex).value === idToUpdate) {
                rowToUpdate = rowNumber;
            }
        });

        if (rowToUpdate) {
            const row = sheet.getRow(rowToUpdate);

            // Find the column indexes for 'FirstName' and 'LastName'
            let firstNameColumnIndex = -1;
            let lastNameColumnIndex = -1;
            sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (cell.value === 'Item') {
                    firstNameColumnIndex = colNumber;
                }
                if (cell.value === 'Priority') {
                    lastNameColumnIndex = colNumber;
                }
            });

            if (firstNameColumnIndex === -1) {
                console.log(`Column 'FirstName' not found.`);
                return `Column 'FirstName' not found.`;
            }
            if (lastNameColumnIndex === -1) {
                console.log(`Column 'LastName' not found.`);
                return `Column 'LastName' not found.`;
            }

            // Update the values in the row
            row.getCell(firstNameColumnIndex).value = newFirstName;
            row.getCell(lastNameColumnIndex).value = newLastName;
            row.commit(); // Commit the row changes
            console.log(`Row with ID ${idToUpdate} updated successfully.`);
            
        } else {
            
            console.log(`Row with ID ${idToUpdate} not found.`);
            
        }

        // Save the file
        await workbook.xlsx.writeFile(filePath);
        return `Row with ID ${idToUpdate} updated successfully.`;
    } catch (error) {
        console.error("An error occurred while processing the file:", error);
    }}

module.exports = { readDataFromExcelFile, writetoExcel, removeRowById,updateNameById };