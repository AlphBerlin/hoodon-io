import React from "react";

export type Channel = {
    id: number;
    name: string;
    status: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    isHost: boolean;
    created_by: string;
}
// Base types for common fields
type Timestamp = string; // ISO string format
type UUID = string;

// Profile related types
export interface Profile {
    id: UUID;
    user_id: UUID;
    display_name: string;
    bio: string | null;
    gender: string | null;
    birth_date: string; // YYYY-MM-DD format
    location: string | null;
    created_at: Timestamp;
    updated_at: Timestamp;
    avatar_url: string | null;
}

export interface ProfileImage {
    id: UUID;
    profile_id: UUID;
    image_url: string;
    is_primary: boolean;
    created_at: Timestamp;
}

export interface Interest {
    id: UUID;
    name: string;
    category: string;
}

export interface ProfileInterest {
    profile_id: UUID;
    interest_id: UUID;
}

// Store related types
export interface StoreItem {
    id: UUID;
    name: string;
    description: string | null;
    price: number;
    hood_url: string;
    preview_image_url: string | null;
    created_at: Timestamp;
    is_available: boolean;
}

export interface UserHood {
    id: UUID;
    profile_id: UUID;
    store_item_id: UUID;
    purchase_date: Timestamp;
    is_equipped: boolean;
}

// Video call related types
export interface VideoCall {
    id: UUID;
    channel_name: string;
    caller_id: UUID;
    receiver_id: UUID;
    start_time: Timestamp;
    end_time: Timestamp | null;
    status: 'initiated' | 'connected' | 'missed' | 'ended';
    created_at: Timestamp;
}

// User connections and chat types
export interface UserConnection {
    id: UUID;
    user_id_1: UUID;
    user_id_2: UUID;
    status: 'pending' | 'connected' | 'blocked';
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface ChatMessage {
    id: UUID;
    connection_id: UUID;
    sender_id: UUID;
    content: string;
    created_at: Timestamp;
    is_read: boolean;
}

// User configuration types
export interface NotificationPreferences {
    messages: boolean;
    calls: boolean;
    matches: boolean;
}

export interface PrivacySettings {
    show_online_status: boolean;
    show_last_seen: boolean;
}

export interface UserAppConfig {
    profile_id: UUID;
    notification_preferences: NotificationPreferences;
    privacy_settings: PrivacySettings;
    theme_preference: 'light' | 'dark';
    updated_at: Timestamp;
}

// Audit and analytics types
export interface AuditLog {
    id: UUID;
    profile_id: UUID;
    action: string;
    table_name: string;
    record_id: UUID;
    old_data: Record<string, any> | null;
    new_data: Record<string, any> | null;
    ip_address: string | null;
    created_at: Timestamp;
}

export interface StoreAnalytics {
    id: UUID;
    store_item_id: UUID;
    total_purchases: number;
    total_revenue: number;
    daily_purchases: number;
    daily_revenue: number;
    weekly_purchases: number;
    weekly_revenue: number;
    monthly_purchases: number;
    monthly_revenue: number;
    last_purchase_date: Timestamp | null;
    updated_at: Timestamp;
}

export interface StoreItemAudit {
    id: UUID;
    store_item_id: UUID;
    action: string;
    old_price: number | null;
    new_price: number | null;
    old_status: boolean | null;
    new_status: boolean | null;
    changed_by: UUID;
    changed_at: Timestamp;
}

export interface UserEngagementMetrics {
    id: UUID;
    profile_id: UUID;
    total_logins: number;
    total_matches: number;
    total_messages_sent: number;
    total_calls_made: number;
    total_call_duration: string; // PostgreSQL interval as string
    last_login: Timestamp | null;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface DailyActiveUsers {
    date: string; // YYYY-MM-DD format
    total_users: number;
    new_users: number;
    returning_users: number;
    total_messages: number;
    total_calls: number;
    total_matches: number;
    created_at: Timestamp;
}

// Response types for API endpoints
export interface PaginatedResponse<T> {
    data: T[];
    metadata: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
    };
}

// Generic database response type
export interface DatabaseResponse<T> {
    data: T | null;
    error: Error | null;
}

// Helper types for common operations
export type CreateProfileDto = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProfileDto = Partial<Omit<Profile, 'user_id' | 'created_at' | 'updated_at'>>;
export type CreateStoreItemDto = Omit<StoreItem, 'id' | 'created_at'>;
export type UpdateStoreItemDto = Partial<Omit<StoreItem, 'id' | 'created_at'>>;

export interface ProfileWithRelations extends Profile {
    interests: Interest[];
    images: ProfileImage[];
}