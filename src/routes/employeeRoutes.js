const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");
const analyticsController = require("../controllers/analyticsController");

// Protect routes and allow only admin access
router.post(
  "/employees",
  authMiddleware,
  roleMiddleware(["admin"]),
  employeeController.addEmployee
);
router.put(
  "/employees/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  employeeController.updateEmployee
);
router.delete(
  "/employees/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  employeeController.deleteEmployee
);
router.get(
  "/employees",
  authMiddleware,
  roleMiddleware(["admin"]),
  employeeController.getEmployees
);

router.get("/profile", authMiddleware, employeeController.viewProfile);
router.put("/profile", authMiddleware, employeeController.updateProfile);

router.get(
  "/analytics/total-employees",
  authMiddleware,
  analyticsController.getTotalEmployees
);
router.get(
  "/analytics/employees-by-department",
  authMiddleware,
  analyticsController.getEmployeesByDepartment
);

module.exports = router;
