import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    students : List.List<{
      name : Text;
      classLevel : Nat;
      house : Text;
      rollNumber : Nat;
    }>;
    notices : Map.Map<Text, {
      title : Text;
      content : Text;
      date : Text;
    }>;
    exams : Map.Map<Text, {
      subject : Text;
      date : Text;
      time : Text;
      classLevel : Nat;
    }>;
  };

  type NewActor = {
    students : List.List<{
      name : Text;
      classLevel : Nat;
      house : Text;
      rollNumber : Nat;
    }>;
    notices : Map.Map<Text, {
      title : Text;
      content : Text;
      date : Text;
    }>;
    exams : Map.Map<Text, {
      subject : Text;
      date : Text;
      time : Text;
      classLevel : Nat;
    }>;
    ads : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      imageUrl : Text;
      linkUrl : Text;
      isActive : Bool;
      createdAt : Int;
    }>;
    nextAdId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let ads = Map.empty<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      imageUrl : Text;
      linkUrl : Text;
      isActive : Bool;
      createdAt : Int;
    }>();
    { old with ads; nextAdId = 1 };
  };
};
