import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Student = {
    name : Text;
    classLevel : Nat;
    house : Text;
    rollNumber : Nat;
  };

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      Nat.compare(student1.rollNumber, student2.rollNumber);
    };
  };

  type Notice = {
    title : Text;
    content : Text;
    date : Text;
  };

  module Notice {
    public func compare(notice1 : Notice, notice2 : Notice) : Order.Order {
      Text.compare(notice1.date, notice2.date);
    };
  };

  type Exam = {
    subject : Text;
    date : Text;
    time : Text;
    classLevel : Nat;
  };

  module Exam {
    public func compare(exam1 : Exam, exam2 : Exam) : Order.Order {
      Text.compare(exam1.date, exam2.date);
    };
  };

  // Storage Structures
  let students = List.empty<Student>();
  let notices = Map.empty<Text, Notice>();
  let exams = Map.empty<Text, Exam>();

  // Student Management
  public shared ({ caller }) func addStudent(name : Text, classLevel : Nat, house : Text, rollNumber : Nat) : async () {
    let newStudent : Student = {
      name;
      classLevel;
      house;
      rollNumber;
    };
    students.add(newStudent);
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    students.toArray().sort();
  };

  // Notice Management
  public shared ({ caller }) func addNotice(title : Text, content : Text, date : Text) : async () {
    let newNotice : Notice = {
      title;
      content;
      date;
    };
    notices.add(title, newNotice);
  };

  public query ({ caller }) func getAllNotices() : async [Notice] {
    let noticesIter = notices.values();
    let noticeArray = noticesIter.toArray();
    noticeArray.sort();
  };

  // Exam Management
  public shared ({ caller }) func addExam(subject : Text, date : Text, time : Text, classLevel : Nat) : async () {
    let newExam : Exam = {
      subject;
      date;
      time;
      classLevel;
    };
    exams.add(subject, newExam);
  };

  public query ({ caller }) func getAllExams() : async [Exam] {
    let examIter = exams.values();
    let examArray = examIter.toArray();
    examArray.sort();
  };
};
