import {Interest, Profile, ProfileInterest, ProfileWithRelations, UpdateProfileDto} from "@/types/database";
import {CreateProfileDto} from "@/types/database";

export const getUser = async (): Promise<ProfileWithRelations | null> => {
    try {
        const response = await fetch(`/api/user-profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(response.status === 400) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error fetching User data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available User:", err);
        throw err;
    }
};
export const addProfile = async (profile:CreateProfileDto): Promise<any> => {
    try {
        const response = await fetch(`/api/user-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(profile),
        });

        if(response.status === 400) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error fetching User data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available User:", err);
        throw err;
    }
};
export const updateProfile = async (profile:UpdateProfileDto): Promise<any> => {
    try {
        const response = await fetch(`/api/user-profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(profile),
        });

        if(response.status === 400) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error fetching User data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available User:", err);
        throw err;
    }
};
export const getInterests = async (): Promise<Record<string,Interest[]>> => {
    try {
        const response = await fetch(`/api/interest`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(response.status === 400) {
            return {};
        }
        if (!response.ok) {
            throw new Error(`Error fetching User data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available User:", err);
        throw err;
    }
};

export const addOrDeleteInterests = async (interestIds: string[]): Promise<any> => {
    try {
        const response = await fetch(`/api/user-profile/interest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(interestIds),
        });

        if(response.status === 400) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error fetching User data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available User:", err);
        throw err;
    }
};