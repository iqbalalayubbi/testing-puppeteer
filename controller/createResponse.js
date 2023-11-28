export const createResponse = (tasks = Array, status = Boolean, message = String) => {
    return { tasks, status, message };
};
