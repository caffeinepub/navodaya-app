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
export interface Exam {
    subject: string;
    date: string;
    time: string;
    classLevel: bigint;
}
export interface Ad {
    id: bigint;
    title: string;
    linkUrl: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    imageUrl: string;
}
export interface UserProfile {
    name: string;
}
export interface Student {
    house: string;
    name: string;
    rollNumber: bigint;
    classLevel: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAd(title: string, description: string, imageUrl: string, linkUrl: string): Promise<bigint>;
    addExam(subject: string, date: string, time: string, classLevel: bigint): Promise<void>;
    addNotice(title: string, content: string, date: string): Promise<void>;
    addStudent(name: string, classLevel: bigint, house: string, rollNumber: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAds(): Promise<Array<Ad>>;
    getAllExams(): Promise<Array<Exam>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllStudents(): Promise<Array<Student>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleAdActive(id: bigint): Promise<void>;
}
