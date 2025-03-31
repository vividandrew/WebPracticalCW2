import express from "express";
import path from "path";
const router = express.Router();

//Functions used for the view
import * as controller from "../controller/controller.js"

//Set Routes names
const route = {
    employee : {
        create : "/employees/create",
        read : "/employee/:id",
        update : "/employees/update/:id",
        delete : "/employees/delete/:id",
        view_all : "/employees",
    },
}

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
