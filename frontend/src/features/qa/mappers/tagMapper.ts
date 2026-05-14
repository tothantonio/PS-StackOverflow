import type {TagDto} from "../types/tagTypes.ts";

export function mapTag(dto : TagDto){
    return{
        id:dto.id,
        name: dto.name,
    }
}

