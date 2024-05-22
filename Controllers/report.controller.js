const Report = require('../Modals/report.modal');
const Staff = require('../Modals/staff.modal');



const Staffreport = async (req, res) => {
  const { staffId, date, tasks } = req.body;

  if (!date || !tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).send({ message: "All fields are required and tasks must be an array with at least one task" });
  }

  const staffExists = await Staff.findById(staffId);
  if (!staffExists) {
    return res.status(400).send({ message: "Staff not found" });
  }

  // Calculate totalTime for each task
  const updatedTasks = tasks.map(task => {
    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);
    const totalTimeMs = endTime - startTime; // Total time in milliseconds

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(totalTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalTimeMs % (1000 * 60)) / 1000);

    return {
      ...task,
      // totalTime: `${hours} hours ${minutes} minutes ${seconds} seconds`
      totalTime: `${hours} hours ${minutes} minutes`
    };
  });

  try {
    let report = await Report.findOne({ staff: staffId, date: new Date(date) });

    if (report) {
      // Append new tasks to the existing report
      report.tasks = report.tasks.concat(updatedTasks);
      report = await report.save();
      return res.send({ message: "Report updated successfully", report });
    } else {
      // Create a new report if none exists for the given date and staff
      const newReport = new Report({
        staff: staffId,
        date,
        tasks: updatedTasks
      });
      const savedReport = await newReport.save();
      return res.send({ message: "Report saved successfully", report: savedReport });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error saving report", error });
  }
};

module.exports = { Staffreport };








const getReportsByDateAndStaff = async (req, res) => {
  const { staffId, date } = req.query;

  if (!staffId || !date) {
    return res.status(400).send({ message: "Staff ID and date are required" });
  }

  try {
    const reports = await Report.find({
      staff: staffId,
      date: new Date(date)
    })
      .populate('staff', 'name') // Only include the name field from the staff schema
      .select('date report tasks'); // Include the date, report, and tasks fields from the report schema

    if (reports.length === 0) {
      return res.status(404).send({ message: "No reports found" });
    }

    return res.send({ reports });
  } catch (error) {
    return res.status(500).send({ message: "Error fetching reports", error });
  }
};

module.exports = { Staffreport, getReportsByDateAndStaff }