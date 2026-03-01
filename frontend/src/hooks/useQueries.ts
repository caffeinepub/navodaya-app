import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, Notice, Exam, Ad } from '../backend';

// ── Students ──────────────────────────────────────────────────────────────────

export function useGetAllStudents() {
    const { actor, isFetching } = useActor();

    return useQuery<Student[]>({
        queryKey: ['students'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllStudents();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddStudent() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            name: string;
            classLevel: bigint;
            house: string;
            rollNumber: bigint;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addStudent(params.name, params.classLevel, params.house, params.rollNumber);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
}

// ── Notices ───────────────────────────────────────────────────────────────────

export function useGetAllNotices() {
    const { actor, isFetching } = useActor();

    return useQuery<Notice[]>({
        queryKey: ['notices'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllNotices();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddNotice() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { title: string; content: string; date: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addNotice(params.title, params.content, params.date);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
}

// ── Exams ─────────────────────────────────────────────────────────────────────

export function useGetAllExams() {
    const { actor, isFetching } = useActor();

    return useQuery<Exam[]>({
        queryKey: ['exams'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllExams();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddExam() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            subject: string;
            date: string;
            time: string;
            classLevel: bigint;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addExam(params.subject, params.date, params.time, params.classLevel);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        },
    });
}

// ── Ads ───────────────────────────────────────────────────────────────────────

export function useGetAllAds() {
    const { actor, isFetching } = useActor();

    return useQuery<Ad[]>({
        queryKey: ['ads'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllAds();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddAd() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            title: string;
            description: string;
            imageUrl: string;
            linkUrl: string;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addAd(params.title, params.description, params.imageUrl, params.linkUrl);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
        },
    });
}

export function useToggleAd() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.toggleAdActive(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
        },
    });
}
