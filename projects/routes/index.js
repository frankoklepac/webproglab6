const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProjectModel = require("../model/project");
const app = require("../app");
var db = require("../model/db");

router.get("/", async (req, res, next) => {
  try {
    const projects = await ProjectModel.find();
    res.render("index", { projects: projects });
  } catch (err) {
    res.status(500).send("Error fetching projects");
  }
});

router.get("/add-project", (req, res) => {
  res.render("add-project");
});

router.post("/add-project", async (req, res) => {
  try {
    const { name, description, price, completed_jobs, start_date, end_date } =
      req.body;

    const project = new ProjectModel({
      name,
      description,
      price,
      completed_jobs,
      start_date,
      end_date,
    });

    await project.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/edit-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await ProjectModel.findById(projectId);
    var start_date = project.start_date.toISOString();
    start_date = start_date.substring(0, start_date.indexOf("T"));
    var end_date = project.end_date.toISOString();
    end_date = end_date.substring(0, end_date.indexOf("T"));

    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("edit-project", {
      start_date: start_date,
      end_date: end_date,
      project: project,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, description, price, completed_jobs, start_date, end_date } =
      req.body;

    await ProjectModel.findByIdAndUpdate(projectId, {
      name,
      description,
      price,
      completed_jobs,
      start_date,
      end_date,
    });

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


router.post("/delete-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    await ProjectModel.findByIdAndDelete(projectId);

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


router.get("/add-team-member/:id", async function (req, res) {
  try {
    const project = await ProjectModel.findById(req.params.id);
    res.render("add-team-member", {
      title: "Add team member",
      project: project,
    });
  } catch (err) {
    res.status(500).send("Error fetching project team member");
  }
});

router.post("/add-team-member/:id", async (req, res) => {
  var projectId = req.params.id;
  var user = req.body.user;

  try {
    const project = await ProjectModel.findById(projectId);

    project.members.push(user);

    await project.save();

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding new team member");
  }
});

module.exports = router;
