
const student = {
    id: 101,
    name: "Sahajit Mondal",
    department: "CSE",
    marks: 85
};

const { id, name, department, marks } = student;

console.log(`Student ID: ${id}`);
console.log(`Name: ${name}`);
console.log(`Department: ${department}`);
console.log(`Marks: ${marks}`);

const getGrade = (marks) => {
    if (marks >= 90) return "A";
    else if (marks >= 80) return "B";
    else if (marks >= 70) return "C";
    else if (marks >= 60) return "D";
    else return "F";
};

const updatedStudent = { ...student, grade: getGrade(marks) };

console.log(`\nUpdated Student Object:`);
console.log(updatedStudent);
