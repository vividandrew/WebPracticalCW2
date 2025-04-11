import express from "express";
const router = express.Router();

//Functions used for the view
import * as homeController from "../controller/homeController.js";
import * as adminController from '../controller/adminController.js';
import * as userController from '../controller/userController.js';

//Set Routes names
const route = {
    home : {
        index : "/",
        about: "/about",
        courses:"/course",
        course: "/course/:id",
        login: "/login",
        register: "/signup"
    },
    user:{
        dashboard: "/dashboard",
        profile: {
            view : '/user/details',
            edit : '/user/edit',
            delete: '/user/delete'
        },
        course : {
            view_all : "/courses",
            read : "/user/course/:id",
            delete : "/admin/course/quit/:id",
        },
    },
    admin:{
        dashboard: "/admin/dashboard",
        user : {
            view_all : "/admin/user",
            create : "/admin/user/create",
            read : "/admin/user/:id",
            update : "/admin/user/update/:id",
            delete : "/admin/user/delete/:id",
        },
        course : {
            view_all : "/admin/course",
            create : "/admin/course/create",
            read : "/admin/course/:id",
            update : "/admin/course/update/:id",
            delete : "/admin/course/delete/:id",
        },
    },

}
// [[HOMECONTROLLER]]
router.get(route.home.index, homeController.home);
router.get(route.home.about, homeController.about);
router.get(route.home.courses, homeController.showCourses);
router.get(route.home.course, homeController.showCourse);

// LOGIN & LOGOUT
router.get(route.home.login, homeController.login);
router.post(route.home.login, homeController.loginPost);

router.post(route.home.index, homeController.logoutPost);

// Register route
router.get(route.home.register, homeController.register);
router.post(route.home.register, homeController.registerPost);

// [[ADMINCONTROLLER]]
router.get(route.admin.dashboard, adminController.dashboard);

// [[USERCONTROLLER]]
router.get(route.user.dashboard, userController.dashboard);

/* Will be used as example routes
router.get('/', controller.root);

// Employees routes
router.get(route.employee.view_all, controller.employees);

//CRUD
router.get(route.employee.create, controller.employeeCreate);
router.post(route.employee.create, controller.employeeCreatePost);

router.get(route.employee.read, controller.employeeRead);

router.get(route.employee.update,controller.employeeUpdate);
router.post(route.employee.update,controller.employeeUpdatePost);

router.get(route.employee.delete,controller.employeeDelete);
router.post(route.employee.delete,controller.employeeDeletePost);
*/
export default router;
