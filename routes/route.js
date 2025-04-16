import express from "express";
const router = express.Router();

// All controllers used in the routing separated for use cases
import * as homeController from "../controller/homeController.js";
import * as adminController from '../controller/adminController.js';
import * as userController from '../controller/userController.js';

//Set Routes names, used as the global url liost used in router
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
            view_all : "/user/course",
            read : "/user/course/:id",
            delete : "/user/course/quit/:id",
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
            receipt : "/admin/course/students/:id",
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

// User CRUD
// List
router.get(route.admin.user.view_all, adminController.userList)

// Create
router.get(route.admin.user.create, adminController.userCreate);
router.post(route.admin.user.create, adminController.userCreatePost);

// Read
router.get(route.admin.user.read, adminController.userRead);

// Update
router.get(route.admin.user.update, adminController.userUpdate);
router.post(route.admin.user.update, adminController.userUpdatePost);

// Delete
router.get(route.admin.user.delete, adminController.userDelete);
router.post(route.admin.user.delete, adminController.userDeletePost);

// Course CRUD
// List
router.get(route.admin.course.view_all, adminController.courseList)

// Create
router.get(route.admin.course.create, adminController.courseCreate);
router.post(route.admin.course.create, adminController.courseCreatePost);

// Read
router.get(route.admin.course.read, adminController.courseRead);

// Update
router.get(route.admin.course.update, adminController.courseUpdate);
router.post(route.admin.course.update, adminController.courseUpdatePost);

// Delete
router.get(route.admin.course.delete, adminController.courseDelete);
router.post(route.admin.course.delete, adminController.courseDeletePost);

// Course Receipt
router.get(route.admin.course.receipt, adminController.printReceipt);

// [[USERCONTROLLER]]
router.get(route.user.dashboard, userController.dashboard);

router.get(route.user.course.view_all, userController.showCourses);
router.get(route.user.course.read, userController.showCourse);

router.post(route.home.course, userController.registerClass); // register class to user

router.get(route.user.course.delete, userController.quitCourse);
router.post(route.user.course.delete, userController.quitCoursePost);
export default router;
