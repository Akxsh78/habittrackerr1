// By default, we export the Mock API because no backend is currently running.
// You can switch this to use the real axios API (e.g. by wrapping them or pointing to realApi.js) 
// when your MERN backend is ready!

export { authAPI, habitsAPI, usersAPI } from './realApi';