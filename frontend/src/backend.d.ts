import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Notice {
    title: string;
    content: string;
    date: string;
}
export interface Student {
    house: string;
    name: string;
    rollNumber: bigint;
    classLevel: bigint;
}
export interface Exam {
    subject: string;
    date: string;
    time: string;
    classLevel: bigint;
}
export interface backendInterface {
    addExam(subject: string, date: string, time: string, classLevel: bigint): Promise<void>;
    addNotice(title: string, content: string, date: string): Promise<void>;
    addStudent(name: string, classLevel: bigint, house: string, rollNumber: bigint): Promise<void>;
    getAllExams(): Promise<Array<Exam>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllStudents(): Promise<Array<Student>>;
}
