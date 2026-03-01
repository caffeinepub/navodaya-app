import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  type Ad = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    linkUrl : Text;
    isActive : Bool;
    createdAt : Int;
  };

  let students = List.empty<Student>();
  let notices = Map.empty<Text, Notice>();
  let exams = Map.empty<Text, Exam>();
  let ads = Map.empty<Nat, Ad>();
  var nextAdId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student Management
  public shared ({ caller }) func addStudent(name : Text, classLevel : Nat, house : Text, rollNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add students");
    };
    let newStudent : Student = {
      name;
      classLevel;
      house;
      rollNumber;
    };
    students.add(newStudent);
  };

  public query func getAllStudents() : async [Student] {
    students.toArray().sort();
  };

  // Notice Management
  public shared ({ caller }) func addNotice(title : Text, content : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notices");
    };
    let newNotice : Notice = {
      title;
      content;
      date;
    };
    notices.add(title, newNotice);
  };

  public query func getAllNotices() : async [Notice] {
    let noticesIter = notices.values();
    let noticeArray = noticesIter.toArray();
    noticeArray.sort();
  };

  // Exam Management
  public shared ({ caller }) func addExam(subject : Text, date : Text, time : Text, classLevel : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exams");
    };
    let newExam : Exam = {
      subject;
      date;
      time;
      classLevel;
    };
    exams.add(subject, newExam);
  };

  public query func getAllExams() : async [Exam] {
    let examIter = exams.values();
    let examArray = examIter.toArray();
    examArray.sort();
  };

  // Ads Management
  public shared ({ caller }) func addAd(
    title : Text,
    description : Text,
    imageUrl : Text,
    linkUrl : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add ads");
    };
    let id = nextAdId;
    let newAd : Ad = {
      id;
      title;
      description;
      imageUrl;
      linkUrl;
      isActive = true;
      createdAt = Time.now();
    };
    ads.add(id, newAd);
    nextAdId += 1;
    id;
  };

  public shared ({ caller }) func toggleAdActive(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle ads");
    };
    switch (ads.get(id)) {
      case (?ad) {
        let updatedAd = { ad with isActive = not ad.isActive };
        ads.add(id, updatedAd);
      };
      case (null) {
        Runtime.trap("Ad not found!");
      };
    };
  };

  public query func getAllAds() : async [Ad] {
    ads.values().toArray();
  };
};
