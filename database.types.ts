export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            audience_segments: {
                Row: {
                    created_at: string | null;
                    criteria: Json;
                    id: string;
                    name: string;
                    org_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    criteria: Json;
                    id?: string;
                    name: string;
                    org_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    criteria?: Json;
                    id?: string;
                    name?: string;
                    org_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'audience_segments_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            blog_posts: {
                Row: {
                    author: string;
                    content: string;
                    created_at: string;
                    excerpt: string | null;
                    featured_image: string | null;
                    id: number;
                    published_at: string | null;
                    slug: string;
                    tags: string[] | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    author: string;
                    content: string;
                    created_at?: string;
                    excerpt?: string | null;
                    featured_image?: string | null;
                    id?: number;
                    published_at?: string | null;
                    slug: string;
                    tags?: string[] | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    author?: string;
                    content?: string;
                    created_at?: string;
                    excerpt?: string | null;
                    featured_image?: string | null;
                    id?: number;
                    published_at?: string | null;
                    slug?: string;
                    tags?: string[] | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            email_campaigns: {
                Row: {
                    body: string;
                    created_at: string | null;
                    id: string;
                    name: string;
                    org_id: string;
                    scheduled_at: string | null;
                    segment_id: string | null;
                    sent_at: string | null;
                    status: string | null;
                    subject: string;
                    updated_at: string | null;
                };
                Insert: {
                    body: string;
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    org_id: string;
                    scheduled_at?: string | null;
                    segment_id?: string | null;
                    sent_at?: string | null;
                    status?: string | null;
                    subject: string;
                    updated_at?: string | null;
                };
                Update: {
                    body?: string;
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    org_id?: string;
                    scheduled_at?: string | null;
                    segment_id?: string | null;
                    sent_at?: string | null;
                    status?: string | null;
                    subject?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'email_campaigns_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'email_campaigns_segment_id_audience_segments_id_fk';
                        columns: ['segment_id'];
                        isOneToOne: false;
                        referencedRelation: 'audience_segments';
                        referencedColumns: ['id'];
                    }
                ];
            };
            email_recipients: {
                Row: {
                    campaign_id: string;
                    clicked_at: string | null;
                    created_at: string | null;
                    customer_id: string;
                    id: string;
                    opened_at: string | null;
                    sent_at: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    campaign_id: string;
                    clicked_at?: string | null;
                    created_at?: string | null;
                    customer_id: string;
                    id?: string;
                    opened_at?: string | null;
                    sent_at?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    campaign_id?: string;
                    clicked_at?: string | null;
                    created_at?: string | null;
                    customer_id?: string;
                    id?: string;
                    opened_at?: string | null;
                    sent_at?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'email_recipients_campaign_id_email_campaigns_id_fk';
                        columns: ['campaign_id'];
                        isOneToOne: false;
                        referencedRelation: 'email_campaigns';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'email_recipients_customer_id_org_customers_id_fk';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    }
                ];
            };
            email_templates: {
                Row: {
                    body: string;
                    created_at: string | null;
                    id: string;
                    name: string;
                    org_id: string;
                    subject: string;
                    updated_at: string | null;
                };
                Insert: {
                    body: string;
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    org_id: string;
                    subject: string;
                    updated_at?: string | null;
                };
                Update: {
                    body?: string;
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    org_id?: string;
                    subject?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'email_templates_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            event_schedules: {
                Row: {
                    created_at: string | null;
                    customer_id: string;
                    event_id: string;
                    id: string;
                    notes: string | null;
                    org_id: string;
                    session_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    customer_id: string;
                    event_id: string;
                    id?: string;
                    notes?: string | null;
                    org_id: string;
                    session_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    customer_id?: string;
                    event_id?: string;
                    id?: string;
                    notes?: string | null;
                    org_id?: string;
                    session_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'event_schedules_customer_id_org_customers_id_fk';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_schedules_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_schedules_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_schedules_session_id_event_sessions_id_fk';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'event_sessions';
                        referencedColumns: ['id'];
                    }
                ];
            };
            event_sessions: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    end_time: string;
                    event_id: string;
                    id: string;
                    location: string | null;
                    name: string;
                    org_id: string;
                    start_time: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    end_time: string;
                    event_id: string;
                    id?: string;
                    location?: string | null;
                    name: string;
                    org_id: string;
                    start_time: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    end_time?: string;
                    event_id?: string;
                    id?: string;
                    location?: string | null;
                    name?: string;
                    org_id?: string;
                    start_time?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'event_sessions_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_sessions_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            event_speakers: {
                Row: {
                    bio: string | null;
                    contact_frequency: string | null;
                    contract_details: Json | null;
                    created_at: string | null;
                    email: string;
                    email_group: string | null;
                    event_id: string;
                    id: string;
                    last_contacted: string | null;
                    name: string;
                    next_follow_up: string | null;
                    notes: string | null;
                    org_id: string;
                    phone: string | null;
                    profile_image_url: string | null;
                    social_links: Json | null;
                    status: string | null;
                    talk_description: string | null;
                    talk_time: string | null;
                    talk_title: string | null;
                    title: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    bio?: string | null;
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    email: string;
                    email_group?: string | null;
                    event_id: string;
                    id?: string;
                    last_contacted?: string | null;
                    name: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    social_links?: Json | null;
                    status?: string | null;
                    talk_description?: string | null;
                    talk_time?: string | null;
                    talk_title?: string | null;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    bio?: string | null;
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    email?: string;
                    email_group?: string | null;
                    event_id?: string;
                    id?: string;
                    last_contacted?: string | null;
                    name?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    social_links?: Json | null;
                    status?: string | null;
                    talk_description?: string | null;
                    talk_time?: string | null;
                    talk_title?: string | null;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'event_speakers_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_speakers_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            events: {
                Row: {
                    address: string | null;
                    city: string | null;
                    country: string | null;
                    created_at: string | null;
                    description: string | null;
                    end_date: string | null;
                    featured_image: string | null;
                    id: string;
                    max_attendees: number | null;
                    name: string;
                    org_id: string;
                    slug: string;
                    start_date: string | null;
                    state: string | null;
                    status: string;
                    updated_at: string | null;
                    venue: string | null;
                    zip_code: string | null;
                };
                Insert: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    featured_image?: string | null;
                    id?: string;
                    max_attendees?: number | null;
                    name: string;
                    org_id: string;
                    slug: string;
                    start_date?: string | null;
                    state?: string | null;
                    status?: string;
                    updated_at?: string | null;
                    venue?: string | null;
                    zip_code?: string | null;
                };
                Update: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    featured_image?: string | null;
                    id?: string;
                    max_attendees?: number | null;
                    name?: string;
                    org_id?: string;
                    slug?: string;
                    start_date?: string | null;
                    state?: string | null;
                    status?: string;
                    updated_at?: string | null;
                    venue?: string | null;
                    zip_code?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'events_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            festival_map_locations: {
                Row: {
                    coordinates: Json;
                    created_at: string | null;
                    description: string | null;
                    event_id: string;
                    id: string;
                    name: string;
                    org_id: string;
                    type: string;
                    updated_at: string | null;
                };
                Insert: {
                    coordinates: Json;
                    created_at?: string | null;
                    description?: string | null;
                    event_id: string;
                    id?: string;
                    name: string;
                    org_id: string;
                    type: string;
                    updated_at?: string | null;
                };
                Update: {
                    coordinates?: Json;
                    created_at?: string | null;
                    description?: string | null;
                    event_id?: string;
                    id?: string;
                    name?: string;
                    org_id?: string;
                    type?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'festival_map_locations_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'festival_map_locations_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            guilds: {
                Row: {
                    contact_frequency: string | null;
                    contract_details: Json | null;
                    created_at: string | null;
                    description: string | null;
                    email_group: string | null;
                    event_id: string;
                    guild_type: string | null;
                    id: string;
                    last_contacted: string | null;
                    leader_contact: string | null;
                    leader_email: string;
                    leader_name: string;
                    name: string;
                    next_follow_up: string | null;
                    notes: string | null;
                    org_id: string;
                    profile_image_url: string | null;
                    status: string | null;
                    updated_at: string | null;
                    website: string | null;
                };
                Insert: {
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    description?: string | null;
                    email_group?: string | null;
                    event_id: string;
                    guild_type?: string | null;
                    id?: string;
                    last_contacted?: string | null;
                    leader_contact?: string | null;
                    leader_email: string;
                    leader_name: string;
                    name: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id: string;
                    profile_image_url?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    website?: string | null;
                };
                Update: {
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    description?: string | null;
                    email_group?: string | null;
                    event_id?: string;
                    guild_type?: string | null;
                    id?: string;
                    last_contacted?: string | null;
                    leader_contact?: string | null;
                    leader_email?: string;
                    leader_name?: string;
                    name?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    profile_image_url?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    website?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'guilds_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'guilds_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_customers: {
                Row: {
                    address: string | null;
                    city: string | null;
                    country: string | null;
                    created_at: string | null;
                    email: string;
                    favorite_event_id: string | null;
                    favorite_performer_id: string | null;
                    id: string;
                    metadata: Json | null;
                    name: string;
                    notes: string | null;
                    org_id: string;
                    org_payment_id: string;
                    phone: string | null;
                    profile_image_url: string | null;
                    state: string | null;
                    status: string | null;
                    updated_at: string | null;
                    zip_code: string | null;
                };
                Insert: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    email: string;
                    favorite_event_id?: string | null;
                    favorite_performer_id?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    name: string;
                    notes?: string | null;
                    org_id: string;
                    org_payment_id: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    state?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    zip_code?: string | null;
                };
                Update: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    email?: string;
                    favorite_event_id?: string | null;
                    favorite_performer_id?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    name?: string;
                    notes?: string | null;
                    org_id?: string;
                    org_payment_id?: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    state?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    zip_code?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_customers_favorite_event_id_events_id_fk';
                        columns: ['favorite_event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_customers_favorite_performer_id_org_performers_id_fk';
                        columns: ['favorite_performer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_performers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_customers_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_customers_org_payment_id_org_payments_id_fk';
                        columns: ['org_payment_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_payments';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_event_attendance: {
                Row: {
                    additional_notes: string | null;
                    attendance_status: string | null;
                    attended_at: string | null;
                    check_in_method: string | null;
                    checked_in_by: string | null;
                    created_at: string | null;
                    customer_id: string;
                    duration: number | null;
                    event_id: string;
                    feedback_score: number | null;
                    id: string;
                    org_id: string;
                    ticket_id: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    additional_notes?: string | null;
                    attendance_status?: string | null;
                    attended_at?: string | null;
                    check_in_method?: string | null;
                    checked_in_by?: string | null;
                    created_at?: string | null;
                    customer_id: string;
                    duration?: number | null;
                    event_id: string;
                    feedback_score?: number | null;
                    id?: string;
                    org_id: string;
                    ticket_id?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    additional_notes?: string | null;
                    attendance_status?: string | null;
                    attended_at?: string | null;
                    check_in_method?: string | null;
                    checked_in_by?: string | null;
                    created_at?: string | null;
                    customer_id?: string;
                    duration?: number | null;
                    event_id?: string;
                    feedback_score?: number | null;
                    id?: string;
                    org_id?: string;
                    ticket_id?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_event_attendance_checked_in_by_user_profiles_id_fk';
                        columns: ['checked_in_by'];
                        isOneToOne: false;
                        referencedRelation: 'user_profiles';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_attendance_customer_id_org_customers_id_fk';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_attendance_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_attendance_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_attendance_ticket_id_org_event_tickets_id_fk';
                        columns: ['ticket_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_event_tickets';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_event_tickets: {
                Row: {
                    barcode: string | null;
                    check_in_status: string | null;
                    created_at: string | null;
                    customer_id: string | null;
                    event_id: string;
                    id: string;
                    is_refunded: boolean | null;
                    name: string;
                    notes: string | null;
                    org_id: string;
                    price: number;
                    promotion_code: string | null;
                    purchase_date: string | null;
                    refund_date: string | null;
                    sales_channel: string | null;
                    seat_number: string | null;
                    status: string;
                    ticket_type_id: string;
                    updated_at: string | null;
                    valid_from: string;
                    valid_until: string;
                };
                Insert: {
                    barcode?: string | null;
                    check_in_status?: string | null;
                    created_at?: string | null;
                    customer_id?: string | null;
                    event_id: string;
                    id?: string;
                    is_refunded?: boolean | null;
                    name: string;
                    notes?: string | null;
                    org_id: string;
                    price: number;
                    promotion_code?: string | null;
                    purchase_date?: string | null;
                    refund_date?: string | null;
                    sales_channel?: string | null;
                    seat_number?: string | null;
                    status?: string;
                    ticket_type_id: string;
                    updated_at?: string | null;
                    valid_from: string;
                    valid_until: string;
                };
                Update: {
                    barcode?: string | null;
                    check_in_status?: string | null;
                    created_at?: string | null;
                    customer_id?: string | null;
                    event_id?: string;
                    id?: string;
                    is_refunded?: boolean | null;
                    name?: string;
                    notes?: string | null;
                    org_id?: string;
                    price?: number;
                    promotion_code?: string | null;
                    purchase_date?: string | null;
                    refund_date?: string | null;
                    sales_channel?: string | null;
                    seat_number?: string | null;
                    status?: string;
                    ticket_type_id?: string;
                    updated_at?: string | null;
                    valid_from?: string;
                    valid_until?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_event_tickets_customer_id_org_customers_id_fk';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_tickets_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_tickets_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_event_tickets_ticket_type_id_org_ticket_types_id_fk';
                        columns: ['ticket_type_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_ticket_types';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_invites: {
                Row: {
                    accepted_at: string | null;
                    created_at: string | null;
                    email: string;
                    expires_at: string | null;
                    id: string;
                    inviter_id: string | null;
                    is_resent: boolean | null;
                    is_revoked: boolean | null;
                    org_id: string;
                    role: string | null;
                    status: string;
                    token: string;
                    updated_at: string | null;
                };
                Insert: {
                    accepted_at?: string | null;
                    created_at?: string | null;
                    email: string;
                    expires_at?: string | null;
                    id?: string;
                    inviter_id?: string | null;
                    is_resent?: boolean | null;
                    is_revoked?: boolean | null;
                    org_id: string;
                    role?: string | null;
                    status: string;
                    token: string;
                    updated_at?: string | null;
                };
                Update: {
                    accepted_at?: string | null;
                    created_at?: string | null;
                    email?: string;
                    expires_at?: string | null;
                    id?: string;
                    inviter_id?: string | null;
                    is_resent?: boolean | null;
                    is_revoked?: boolean | null;
                    org_id?: string;
                    role?: string | null;
                    status?: string;
                    token?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_invites_inviter_id_user_profiles_id_fk';
                        columns: ['inviter_id'];
                        isOneToOne: false;
                        referencedRelation: 'user_profiles';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_invites_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_members: {
                Row: {
                    created_at: string | null;
                    departed_at: string | null;
                    department: string | null;
                    email: string;
                    event_id: string;
                    id: string;
                    is_active: boolean | null;
                    is_admin: boolean | null;
                    is_verified: boolean | null;
                    joined_date: string;
                    last_login: string | null;
                    name: string;
                    notes: string | null;
                    org_id: string;
                    permissions: Json | null;
                    phone_number: string | null;
                    profile_image_url: string | null;
                    role: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    departed_at?: string | null;
                    department?: string | null;
                    email: string;
                    event_id: string;
                    id?: string;
                    is_active?: boolean | null;
                    is_admin?: boolean | null;
                    is_verified?: boolean | null;
                    joined_date: string;
                    last_login?: string | null;
                    name: string;
                    notes?: string | null;
                    org_id: string;
                    permissions?: Json | null;
                    phone_number?: string | null;
                    profile_image_url?: string | null;
                    role: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    departed_at?: string | null;
                    department?: string | null;
                    email?: string;
                    event_id?: string;
                    id?: string;
                    is_active?: boolean | null;
                    is_admin?: boolean | null;
                    is_verified?: boolean | null;
                    joined_date?: string;
                    last_login?: string | null;
                    name?: string;
                    notes?: string | null;
                    org_id?: string;
                    permissions?: Json | null;
                    phone_number?: string | null;
                    profile_image_url?: string | null;
                    role?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_members_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_members_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_payments: {
                Row: {
                    account_type: string;
                    available_balance: number | null;
                    country: string | null;
                    created_at: string | null;
                    id: string;
                    last_payout_date: string | null;
                    last_transaction_date: string | null;
                    notes: string | null;
                    org_id: string;
                    pending_balance: number | null;
                    status: string;
                    stripe_account_id: string;
                    total_fees_paid: number | null;
                    total_payouts: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    account_type?: string;
                    available_balance?: number | null;
                    country?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_payout_date?: string | null;
                    last_transaction_date?: string | null;
                    notes?: string | null;
                    org_id: string;
                    pending_balance?: number | null;
                    status?: string;
                    stripe_account_id: string;
                    total_fees_paid?: number | null;
                    total_payouts?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    account_type?: string;
                    available_balance?: number | null;
                    country?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_payout_date?: string | null;
                    last_transaction_date?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    pending_balance?: number | null;
                    status?: string;
                    stripe_account_id?: string;
                    total_fees_paid?: number | null;
                    total_payouts?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_payments_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_performers: {
                Row: {
                    contact_frequency: string | null;
                    contract_details: Json | null;
                    created_at: string | null;
                    email: string;
                    email_group: string | null;
                    event_id: string;
                    genre: string | null;
                    id: string;
                    last_contacted: string | null;
                    name: string;
                    next_follow_up: string | null;
                    notes: string | null;
                    org_id: string;
                    performance_time: string | null;
                    phone: string | null;
                    profile_image_url: string | null;
                    social_links: Json | null;
                    stage_name: string;
                    status: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    email: string;
                    email_group?: string | null;
                    event_id: string;
                    genre?: string | null;
                    id?: string;
                    last_contacted?: string | null;
                    name: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id: string;
                    performance_time?: string | null;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    social_links?: Json | null;
                    stage_name: string;
                    status?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    created_at?: string | null;
                    email?: string;
                    email_group?: string | null;
                    event_id?: string;
                    genre?: string | null;
                    id?: string;
                    last_contacted?: string | null;
                    name?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    performance_time?: string | null;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    social_links?: Json | null;
                    stage_name?: string;
                    status?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_performers_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_performers_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_referral_programs: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    org_id: string;
                    reward: string;
                    status: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    org_id: string;
                    reward: string;
                    status?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    org_id?: string;
                    reward?: string;
                    status?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_referral_programs_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_ticket_types: {
                Row: {
                    available_online: boolean | null;
                    category: string | null;
                    created_at: string | null;
                    currency: string | null;
                    description: string | null;
                    event_date: string;
                    event_id: string;
                    group_discount_available: boolean | null;
                    id: string;
                    is_early_bird: boolean | null;
                    is_free: boolean | null;
                    max_per_customer: number | null;
                    name: string;
                    org_id: string;
                    price: number;
                    promo_code_required: boolean | null;
                    quantity: number;
                    refundable: boolean | null;
                    sale_end_date: string;
                    sale_start_date: string;
                    sales_limit_per_day: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    available_online?: boolean | null;
                    category?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    description?: string | null;
                    event_date: string;
                    event_id: string;
                    group_discount_available?: boolean | null;
                    id?: string;
                    is_early_bird?: boolean | null;
                    is_free?: boolean | null;
                    max_per_customer?: number | null;
                    name: string;
                    org_id: string;
                    price: number;
                    promo_code_required?: boolean | null;
                    quantity: number;
                    refundable?: boolean | null;
                    sale_end_date: string;
                    sale_start_date: string;
                    sales_limit_per_day?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    available_online?: boolean | null;
                    category?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    description?: string | null;
                    event_date?: string;
                    event_id?: string;
                    group_discount_available?: boolean | null;
                    id?: string;
                    is_early_bird?: boolean | null;
                    is_free?: boolean | null;
                    max_per_customer?: number | null;
                    name?: string;
                    org_id?: string;
                    price?: number;
                    promo_code_required?: boolean | null;
                    quantity?: number;
                    refundable?: boolean | null;
                    sale_end_date?: string;
                    sale_start_date?: string;
                    sales_limit_per_day?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_ticket_types_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_ticket_types_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_transaction_items: {
                Row: {
                    created_at: string | null;
                    currency: string;
                    discount_amount: number | null;
                    id: string;
                    is_refundable: boolean | null;
                    item_type: string;
                    notes: string | null;
                    order_id: string;
                    promotion_code_used: string | null;
                    quantity: number;
                    tax_amount: number | null;
                    ticket_id: string;
                    total_price: number;
                    transaction_source: string;
                    unit_price: number;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    currency?: string;
                    discount_amount?: number | null;
                    id?: string;
                    is_refundable?: boolean | null;
                    item_type?: string;
                    notes?: string | null;
                    order_id: string;
                    promotion_code_used?: string | null;
                    quantity: number;
                    tax_amount?: number | null;
                    ticket_id: string;
                    total_price: number;
                    transaction_source?: string;
                    unit_price: number;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    currency?: string;
                    discount_amount?: number | null;
                    id?: string;
                    is_refundable?: boolean | null;
                    item_type?: string;
                    notes?: string | null;
                    order_id?: string;
                    promotion_code_used?: string | null;
                    quantity?: number;
                    tax_amount?: number | null;
                    ticket_id?: string;
                    total_price?: number;
                    transaction_source?: string;
                    unit_price?: number;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_transaction_items_order_id_org_transactions_id_fk';
                        columns: ['order_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_transactions';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_transaction_items_ticket_id_org_event_tickets_id_fk';
                        columns: ['ticket_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_event_tickets';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_transactions: {
                Row: {
                    application_fee_amount: number;
                    created_at: string | null;
                    currency: string | null;
                    customer_id: string;
                    description: string | null;
                    id: string;
                    invoice_id: string | null;
                    metadata: Json | null;
                    net_amount: number | null;
                    org_id: string;
                    payment_method: string | null;
                    refund_status: string | null;
                    related_entity_id: string | null;
                    status: string | null;
                    stripe_fee_amount: number;
                    stripe_payment_id: string | null;
                    total_amount: number;
                    transaction_type: string;
                    updated_at: string | null;
                };
                Insert: {
                    application_fee_amount?: number;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id: string;
                    description?: string | null;
                    id?: string;
                    invoice_id?: string | null;
                    metadata?: Json | null;
                    net_amount?: number | null;
                    org_id: string;
                    payment_method?: string | null;
                    refund_status?: string | null;
                    related_entity_id?: string | null;
                    status?: string | null;
                    stripe_fee_amount: number;
                    stripe_payment_id?: string | null;
                    total_amount: number;
                    transaction_type: string;
                    updated_at?: string | null;
                };
                Update: {
                    application_fee_amount?: number;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string;
                    description?: string | null;
                    id?: string;
                    invoice_id?: string | null;
                    metadata?: Json | null;
                    net_amount?: number | null;
                    org_id?: string;
                    payment_method?: string | null;
                    refund_status?: string | null;
                    related_entity_id?: string | null;
                    status?: string | null;
                    stripe_fee_amount?: number;
                    stripe_payment_id?: string | null;
                    total_amount?: number;
                    transaction_type?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_transactions_customer_id_org_customers_id_fk';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_transactions_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            org_vendors: {
                Row: {
                    address: string | null;
                    business_name: string;
                    city: string | null;
                    contact_frequency: string | null;
                    contract_details: Json | null;
                    country: string | null;
                    created_at: string | null;
                    email: string;
                    email_group: string | null;
                    event_id: string;
                    id: string;
                    last_contacted: string | null;
                    name: string;
                    next_follow_up: string | null;
                    notes: string | null;
                    org_id: string;
                    phone: string | null;
                    profile_image_url: string | null;
                    state: string | null;
                    status: string | null;
                    updated_at: string | null;
                    vendor_type: string | null;
                    website: string | null;
                    zip_code: string | null;
                };
                Insert: {
                    address?: string | null;
                    business_name: string;
                    city?: string | null;
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    country?: string | null;
                    created_at?: string | null;
                    email: string;
                    email_group?: string | null;
                    event_id: string;
                    id?: string;
                    last_contacted?: string | null;
                    name: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    state?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    vendor_type?: string | null;
                    website?: string | null;
                    zip_code?: string | null;
                };
                Update: {
                    address?: string | null;
                    business_name?: string;
                    city?: string | null;
                    contact_frequency?: string | null;
                    contract_details?: Json | null;
                    country?: string | null;
                    created_at?: string | null;
                    email?: string;
                    email_group?: string | null;
                    event_id?: string;
                    id?: string;
                    last_contacted?: string | null;
                    name?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    state?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    vendor_type?: string | null;
                    website?: string | null;
                    zip_code?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'org_vendors_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'org_vendors_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            organizations: {
                Row: {
                    address: string | null;
                    affiliated_organizations: Json | null;
                    annual_revenue: number | null;
                    city: string | null;
                    contact_email: string | null;
                    contact_phone: string | null;
                    country: string | null;
                    created_at: string;
                    founded_date: string | null;
                    id: string;
                    industry: string | null;
                    is_verified: boolean | null;
                    last_activity: string | null;
                    logo_url: string | null;
                    metadata: Json | null;
                    name: string;
                    number_of_employees: number | null;
                    org_type: string | null;
                    social_media_links: Json | null;
                    state: string | null;
                    status: string;
                    subscription_status: string | null;
                    updated_at: string;
                    website: string | null;
                    zip_code: string | null;
                };
                Insert: {
                    address?: string | null;
                    affiliated_organizations?: Json | null;
                    annual_revenue?: number | null;
                    city?: string | null;
                    contact_email?: string | null;
                    contact_phone?: string | null;
                    country?: string | null;
                    created_at?: string;
                    founded_date?: string | null;
                    id?: string;
                    industry?: string | null;
                    is_verified?: boolean | null;
                    last_activity?: string | null;
                    logo_url?: string | null;
                    metadata?: Json | null;
                    name: string;
                    number_of_employees?: number | null;
                    org_type?: string | null;
                    social_media_links?: Json | null;
                    state?: string | null;
                    status?: string;
                    subscription_status?: string | null;
                    updated_at?: string;
                    website?: string | null;
                    zip_code?: string | null;
                };
                Update: {
                    address?: string | null;
                    affiliated_organizations?: Json | null;
                    annual_revenue?: number | null;
                    city?: string | null;
                    contact_email?: string | null;
                    contact_phone?: string | null;
                    country?: string | null;
                    created_at?: string;
                    founded_date?: string | null;
                    id?: string;
                    industry?: string | null;
                    is_verified?: boolean | null;
                    last_activity?: string | null;
                    logo_url?: string | null;
                    metadata?: Json | null;
                    name?: string;
                    number_of_employees?: number | null;
                    org_type?: string | null;
                    social_media_links?: Json | null;
                    state?: string | null;
                    status?: string;
                    subscription_status?: string | null;
                    updated_at?: string;
                    website?: string | null;
                    zip_code?: string | null;
                };
                Relationships: [];
            };
            subscription_products: {
                Row: {
                    billing_interval: string;
                    created_at: string | null;
                    description: string | null;
                    feature_set: Json | null;
                    id: string;
                    is_active: boolean | null;
                    is_popular: boolean | null;
                    name: string;
                    price: number;
                    promotion_details: Json | null;
                    sales_count: number | null;
                    stripe_price_id: string;
                    stripe_product_id: string;
                    target_audience: string | null;
                    trial_period_days: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    billing_interval: string;
                    created_at?: string | null;
                    description?: string | null;
                    feature_set?: Json | null;
                    id?: string;
                    is_active?: boolean | null;
                    is_popular?: boolean | null;
                    name: string;
                    price: number;
                    promotion_details?: Json | null;
                    sales_count?: number | null;
                    stripe_price_id: string;
                    stripe_product_id: string;
                    target_audience?: string | null;
                    trial_period_days?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    billing_interval?: string;
                    created_at?: string | null;
                    description?: string | null;
                    feature_set?: Json | null;
                    id?: string;
                    is_active?: boolean | null;
                    is_popular?: boolean | null;
                    name?: string;
                    price?: number;
                    promotion_details?: Json | null;
                    sales_count?: number | null;
                    stripe_price_id?: string;
                    stripe_product_id?: string;
                    target_audience?: string | null;
                    trial_period_days?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            subscriptions: {
                Row: {
                    billing_interval: string;
                    cancel_at_period_end: boolean | null;
                    cancellation_date: string | null;
                    created_at: string | null;
                    id: string;
                    last_payment_date: string | null;
                    next_billing_date: string | null;
                    notes: string | null;
                    org_id: string;
                    product_id: string;
                    renewal_count: number | null;
                    revenue_generated: number | null;
                    stripe_customer_id: string;
                    stripe_subscription_id: string;
                    subscription_end_date: string | null;
                    subscription_start_date: string;
                    subscription_status: string;
                    trial_end_date: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    billing_interval: string;
                    cancel_at_period_end?: boolean | null;
                    cancellation_date?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_payment_date?: string | null;
                    next_billing_date?: string | null;
                    notes?: string | null;
                    org_id: string;
                    product_id: string;
                    renewal_count?: number | null;
                    revenue_generated?: number | null;
                    stripe_customer_id: string;
                    stripe_subscription_id: string;
                    subscription_end_date?: string | null;
                    subscription_start_date: string;
                    subscription_status: string;
                    trial_end_date?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    billing_interval?: string;
                    cancel_at_period_end?: boolean | null;
                    cancellation_date?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_payment_date?: string | null;
                    next_billing_date?: string | null;
                    notes?: string | null;
                    org_id?: string;
                    product_id?: string;
                    renewal_count?: number | null;
                    revenue_generated?: number | null;
                    stripe_customer_id?: string;
                    stripe_subscription_id?: string;
                    subscription_end_date?: string | null;
                    subscription_start_date?: string;
                    subscription_status?: string;
                    trial_end_date?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'subscriptions_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'subscriptions_product_id_subscription_products_id_fk';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'subscription_products';
                        referencedColumns: ['id'];
                    }
                ];
            };
            ticket_analytics: {
                Row: {
                    clicks: number | null;
                    created_at: string | null;
                    id: string;
                    purchases: number | null;
                    ticket_page_id: string;
                    updated_at: string | null;
                    views: number | null;
                };
                Insert: {
                    clicks?: number | null;
                    created_at?: string | null;
                    id?: string;
                    purchases?: number | null;
                    ticket_page_id: string;
                    updated_at?: string | null;
                    views?: number | null;
                };
                Update: {
                    clicks?: number | null;
                    created_at?: string | null;
                    id?: string;
                    purchases?: number | null;
                    ticket_page_id?: string;
                    updated_at?: string | null;
                    views?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'ticket_analytics_ticket_page_id_ticket_pages_id_fk';
                        columns: ['ticket_page_id'];
                        isOneToOne: false;
                        referencedRelation: 'ticket_pages';
                        referencedColumns: ['id'];
                    }
                ];
            };
            ticket_pages: {
                Row: {
                    average_time_on_page: number | null;
                    bounce_rate: number | null;
                    conversion_rate: number | null;
                    created_at: string | null;
                    description: string | null;
                    device_type: string | null;
                    entry_page: boolean | null;
                    event_id: string;
                    exit_page: boolean | null;
                    id: string;
                    org_id: string;
                    page_title: string;
                    referral_source: string | null;
                    updated_at: string | null;
                    url: string;
                };
                Insert: {
                    average_time_on_page?: number | null;
                    bounce_rate?: number | null;
                    conversion_rate?: number | null;
                    created_at?: string | null;
                    description?: string | null;
                    device_type?: string | null;
                    entry_page?: boolean | null;
                    event_id: string;
                    exit_page?: boolean | null;
                    id?: string;
                    org_id: string;
                    page_title: string;
                    referral_source?: string | null;
                    updated_at?: string | null;
                    url: string;
                };
                Update: {
                    average_time_on_page?: number | null;
                    bounce_rate?: number | null;
                    conversion_rate?: number | null;
                    created_at?: string | null;
                    description?: string | null;
                    device_type?: string | null;
                    entry_page?: boolean | null;
                    event_id?: string;
                    exit_page?: boolean | null;
                    id?: string;
                    org_id?: string;
                    page_title?: string;
                    referral_source?: string | null;
                    updated_at?: string | null;
                    url?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'ticket_pages_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'ticket_pages_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            user_profiles: {
                Row: {
                    bio: string | null;
                    contact_number: string | null;
                    created_at: string | null;
                    department: string | null;
                    id: string;
                    is_active: boolean | null;
                    last_login: string | null;
                    org_id: string;
                    organization_name: string;
                    permissions: Json | null;
                    preferences: Json | null;
                    profile_image_url: string | null;
                    role: string;
                    social_links: Json | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    bio?: string | null;
                    contact_number?: string | null;
                    created_at?: string | null;
                    department?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    last_login?: string | null;
                    org_id: string;
                    organization_name: string;
                    permissions?: Json | null;
                    preferences?: Json | null;
                    profile_image_url?: string | null;
                    role?: string;
                    social_links?: Json | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    bio?: string | null;
                    contact_number?: string | null;
                    created_at?: string | null;
                    department?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    last_login?: string | null;
                    org_id?: string;
                    organization_name?: string;
                    permissions?: Json | null;
                    preferences?: Json | null;
                    profile_image_url?: string | null;
                    role?: string;
                    social_links?: Json | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'user_profiles_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    }
                ];
            };
            visitor_schedules: {
                Row: {
                    created_at: string | null;
                    event_id: string;
                    id: string;
                    org_id: string;
                    session_id: string | null;
                    updated_at: string | null;
                    visitor_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    event_id: string;
                    id?: string;
                    org_id: string;
                    session_id?: string | null;
                    updated_at?: string | null;
                    visitor_id: string;
                };
                Update: {
                    created_at?: string | null;
                    event_id?: string;
                    id?: string;
                    org_id?: string;
                    session_id?: string | null;
                    updated_at?: string | null;
                    visitor_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'visitor_schedules_event_id_events_id_fk';
                        columns: ['event_id'];
                        isOneToOne: false;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'visitor_schedules_org_id_organizations_id_fk';
                        columns: ['org_id'];
                        isOneToOne: false;
                        referencedRelation: 'organizations';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'visitor_schedules_session_id_event_sessions_id_fk';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'event_sessions';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'visitor_schedules_visitor_id_org_customers_id_fk';
                        columns: ['visitor_id'];
                        isOneToOne: false;
                        referencedRelation: 'org_customers';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
      ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never;
