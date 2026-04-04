function StudentCard({ name, department, marks }) {
  return (
    <div className="student-card">
      <h2>{name}</h2>
      <p><strong>Department:</strong> {department}</p>
      <p><strong>Marks:</strong> {marks}</p>
    </div>
  );
}

export default StudentCard;
