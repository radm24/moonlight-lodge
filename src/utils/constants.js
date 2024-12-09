import { supabaseUrl } from "../services/supabase";

export const PAGE_SIZE = 10;
export const CABIN_IMAGES_PATH = `${supabaseUrl}/storage/v1/object/public/cabin-images/`;
export const RESERVED_CABIN_IMAGES = [
  "cabin-001.jpg",
  "cabin-002.jpg",
  "cabin-003.jpg",
  "cabin-004.jpg",
  "cabin-005.jpg",
  "cabin-006.jpg",
  "cabin-007.jpg",
  "cabin-008.jpg",
];
