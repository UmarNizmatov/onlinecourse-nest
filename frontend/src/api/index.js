import api from './axios';

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const refreshToken = () => api.post('/auth/refresh');

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const getCourseModules = (courseId) => api.get(`/courses/${courseId}/modules`);

// Modules
export const getModules = () => api.get('/modules');
export const getModule = (id) => api.get(`/modules/${id}`);
export const createModule = (data) => api.post('/modules/new', data);
export const updateModule = (id, data) => api.patch(`/modules/${id}`, data);
export const deleteModule = (id) => api.delete(`/modules/${id}`);
export const getModuleLessons = (moduleId) => api.get(`/modules/${moduleId}/lessons`);

// Lessons
export const getLessons = () => api.get('/lesson');
export const getLesson = (id) => api.get(`/lesson/${id}`);
export const createLesson = (formData) => api.post('/lesson', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateLesson = (id, data) => api.patch(`/lesson/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lesson/${id}`);

// Assignments
export const getAssignments = () => api.get('/assigment');
export const getAssignment = (id) => api.get(`/assigment/${id}`);
export const getAssignmentsByModule = (moduleId) => api.get(`/assigment/module/${moduleId}`);
export const createAssignment = (moduleId, data) => api.post(`/assigment/${moduleId}/add_assignment`, data);
export const updateAssignment = (id, data) => api.patch(`/assigment/${id}`, data);
export const deleteAssignment = (id) => api.delete(`/assigment/${id}`);

// Enrollments
export const enroll = (courseId) => api.post('/student-courses', { courseId });
export const getMyEnrollments = () => api.get('/student-courses');
export const deleteEnrollment = (id) => api.delete(`/student-courses/${id}`);

// Submissions
export const getSubmissions = () => api.get('/submission');
export const getSubmission = (id) => api.get(`/submission/${id}`);
export const createSubmission = (formData) => api.post('/submission', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const checkSubmission = (id, data) => api.post(`/submission/${id}/check`, data);
export const deleteSubmission = (id) => api.delete(`/submission/${id}`);

// Results
export const getMyResults = () => api.get('/results');
