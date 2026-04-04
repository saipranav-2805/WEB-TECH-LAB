function StudentProfile() {
  const name = "Sahamon";
  const department = "Computer Science and Engineering";
  const year = "3rd Year";
  const section = "A";

  return (
    <div className="profile-card">
      <h1>Student Profile</h1>
      <div className="profile-details">
        <h2>{name}</h2>
        <p><strong>Department:</strong> {department}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Section:</strong> {section}</p>
      </div>
    </div>
  );
}

export default StudentProfile;
