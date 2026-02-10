// Server Actions barrel export
export * from "./auth";
export * from "./students";
export * from "./classes";
export * from "./sections";
export * from "./fees";
export * from "./promotions";
export * from "./teachers";
export * from "./operators";
// Exclude uploadStudentPhoto from upload.ts to avoid conflict with students.ts
export { uploadImage, uploadSchoolLogo, uploadTeacherPhoto, deleteImage } from "./upload";
export * from "./settings";
