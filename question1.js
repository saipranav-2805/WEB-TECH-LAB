
const studentName = "John Doe";

const marks1 = 85;
const marks2 = 92;
const marks3 = 78;
const marks4 = 90;
const marks5 = 88;

let totalMarks = 0;
let averageMarks = 0;

const calculateTotal = (marks1, marks2, marks3, marks4, marks5) => marks1 + marks2 + marks3 + marks4 + marks5;
const calculateAverage = (total, count) => total / count;
totalMarks = calculateTotal(marks1, marks2, marks3, marks4, marks5);
averageMarks = calculateAverage(totalMarks, 5);

console.log(`Student Name: ${studentName}`);
console.log(`Marks: ${marks1}, ${marks2}, ${marks3}, ${marks4}, ${marks5}`);
console.log(`Total Marks: ${totalMarks}`);
console.log(`Average Marks: ${averageMarks.toFixed(2)}`);