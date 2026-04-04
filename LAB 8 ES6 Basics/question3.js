
class Course {
    constructor(courseName, instructor) {
        this.courseName = courseName;
        this.instructor = instructor;
    }

    displayDetails() {
        console.log(`Course: ${this.courseName}, Instructor: ${this.instructor}`);
    }

    enroll(seatsAvailable) {
        return new Promise((resolve, reject) => {
            if (seatsAvailable > 0) {
                resolve("Enrollment Successful");
            } else {
                reject("Course Full");
            }
        });
    }
}

const course = new Course("Web Technologies", "Dr. S Gopikrishnan");
course.displayDetails();

course.enroll(5)
    .then((message) => console.log(message))
    .catch((error) => console.log(error));
