import { UUID } from "crypto";

declare interface FileInfo{
    id: number,
    created_at: string,
    file_uuid: UUID,
    file_owner_id: UUID,
    file_path: string,
    file_name: string,
    file_size: number,
    file_type: string, 
    signedUrl: {
        signedUrl: string
    }
}

declare interface TrashFileInfo{
    id: number,
    created_at: string,
    file_uuid: UUID,
    file_owner_id: UUID,
    file_path: string,
    file_name: string,
    file_size: number,
    file_type: string
}

declare interface SearchFileInfo{
    file_name: string,
    file_uuid: UUID,
    created_at: string,
    file_type: string, 
    file_size: number,
}

declare interface ActionType {
    label: string;
    icon: string;
    value: string;
}

declare interface SharedFileInfo{
    id: number,
    accesser_added_at: string,
    file_uuid: UUID,
    file_size: number,
    owner_id: UUID,
    owner_email: string,
    owner_name: string,
    accesser_id: UUID,
    accesser_email: string,
    permission_type: string,
    file_name: string,
    signedUrl: {
        signedUrl: string
    }
}
  
declare interface StorageInfo{
    file_type: string,
    total_size: number
}

declare interface AccesserInfo{
    accesser_id: UUID,
    accesser_email: string,
    permission_type: string
} 