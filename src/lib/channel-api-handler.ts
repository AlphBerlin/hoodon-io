import {Channel} from "@/types/database";

export const updateChannel =  ({id,name, status}:{id?:number,name:string,status:string}) => {
    fetch("/api/channel", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            status: status,
        }),
    }).then(response => {
        return response.json();
    }).catch(err => {
        return Promise.reject(err);
    });
}
export const deleteChannel =  ({name}:{name?:string}) => {
    fetch("/api/channel", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
        }),
    }).then(response => {
        return response.json();
    }).catch(err => {
        return Promise.reject(err);
    });
}

export const getAvailableChannel = async (): Promise<any> => {
    try {
        const response = await fetch("/api/channel/get-available", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching channel data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available channel:", err);
        throw err;
    }
};

export const createMyChannel = async (): Promise<Channel> => {
    try {
        const response = await fetch("/api/channel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching channel data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available channel:", err);
        throw err;
    }
};

export const getChannel = async ({channelName}:any): Promise<any> => {
    try {
        const response = await fetch(`/api/channel?name=${channelName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching channel data: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Failed to fetch available channel:", err);
        throw err;
    }
};
