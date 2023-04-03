class Class {
    constructor(name) {
        this.name = name;
        this.students = [];
    }
    addStudent(firstName, lastName) {
        this.students.push(new Student(firstName, lastName));
    }
}
 
class Student {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class ClassService {
    static url = "https://642b2fc6d7081590f91e26a9.mockapi.io/ClassRooms";

    static getAllClasses() {
        return $.get(this.url);
    }

    static getClass(id) {
        return $.get(this.url + `/${id}`);
    }

    static createClass(classe) {
        return $.post(this.url, classe);
    }
    
    static updateClass(classe) {
        return $.ajax({
            url: this.url + `/${classe._id}`,
            dataType: `json`,
            data: JSON.stringify(classe),
            contentType: `application/json`,
            type: `PUT`
        });
    }

    static deleteClass(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: `DELETE`
        });
    }
}

class DOMManager {
    static classes;

    static getAllClasses() {
        ClassService.getAllClasses().then(classes => this.render(classes));
    }
    static createClass(name) {
        ClassService.createClass(new Class(name))
        .then(() => {
            return ClassService.getAllClasses();
        })
        .then((classes) => this.render(classes));
    }

    static deleteClass(id) {
        ClassService.deleteClass(id)
        .then(() => {
            return ClassService.getAllClasses();
        
        })
        .then((classes) => this.render(classes));
    }
    static addStudent(id) {
        for (let classe of this.classes) {
            if (classe.id == id) {
                classe.students.push(new Student($(`#${classe.id}-room-name`).val(), $(`#${classe.id}-room-area`).val()));
                ClassService.updateClass(classe)
                .then(() => {
                    return ClassService.getAllClasses();
                })
                .then((classes) => this.render(classes));
            }
        }
    }
    static deleteStudent(classId, studentId) {
        for (let classe of this.classes) {
            if (classe.id == classId) {
                for (let student of classe.students) {
                    if (student.id == studentId) {
                        classe.students.splice(classe.students.indexOf(student), 1);
                        ClassService.updateClass(classe).then(() => {
                            return ClassService.getAllClasses();
                        })
                        .then((classes) => this.render(classes));
                    }
                }
            }
        }
    }


    static render(classes) {
        this.classes = classes;
        $(`#app`).empty();
        for (let classe of classes) {
            $(`#app`).prepend(
                `<div id="${classe.id}" class="card">
                    <div class="card-header">
                        <h2>${classe.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteClass('${classe.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${classe.id}-room-name" class="form-control" placeholder="First Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${classe.id}-room-area" class="form-control" placeholder="Last Name">
                                </div>

                            </div>
                            <button id="${classe.id}-new-room" onclick="DOMManager.addStudent('${classe.id}')" class="btn btn-primary form-control">Add</button>

                        </div>
                    </div>
                </div>
                <br>`

            ); 
            for (let student of classe.students) {
                $(`#${classe.id}`).find(`.card-body`).append(
                    `<p>
                    <span id="firstName-${student.id}"><strong>First Name:</strong> ${student.firstName}</span>
                    <span id="lastname-${student.id}"><strong>Last Name:</strong> ${student.lastName}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteStudent('${classe.id}',  '${student.id}')">Delete Student</button>
                    </p>`
                )
               
            }
        } 
    }
}
$('#create-new-class').click(() => {
    DOMManager.createClass($('#new-class-name').val());
    $('#new-class-name').val('');
});

DOMManager.getAllClasses(); 