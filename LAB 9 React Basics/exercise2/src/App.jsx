import StudentCard from './components/StudentCard';
import './App.css';

function App() {
  const students = [
    { name: "Sahamon", department: "Computer Science and Engineering", marks: 92 },
    { name: "Arun Kumar", department: "Electronics and Communication", marks: 85 },
    { name: "Priya Sharma", department: "Information Technology", marks: 88 },
    { name: "Deepak Raj", department: "Mechanical Engineering", marks: 78 },
  ];

  return (
    <div>
      <h1 className="page-title">Student Cards</h1>
      <div className="cards-container">
        {students.map((student, index) => (
          <StudentCard
            key={index}
            name={student.name}
            department={student.department}
            marks={student.marks}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
