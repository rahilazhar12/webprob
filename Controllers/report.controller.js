const Report = require('../Modals/report.modal');
const Staff = require('../Modals/staff.modal');



const Staffreport = async (req, res) => {
    const { staffId, date, report } = req.body;

    if (!date || !report) {
        return res.status(400).send({ message: "All fields are required" });
    }

    const staffExists = await Staff.findById(staffId);
    if (!staffExists) {
        return res.status(400).send({ message: "Staff not found" });
    }

    const newReport = new Report({
        staff: staffId,
        date,
        report
    });

    try {
        const savedReport = await newReport.save();
        return res.send({ message: "Report saved successfully", report: savedReport });
    } catch (error) {
        return res.status(500).send({ message: "Error saving report", error });
    }
};

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
      .select('date report'); // Only include the date and report fields from the report schema
  
      if (reports.length === 0) {
        return res.status(404).send({ message: "No reports found" });
      }
  
      return res.send({ reports });
    } catch (error) {
      return res.status(500).send({ message: "Error fetching reports", error });
    }
  };



module.exports = { Staffreport , getReportsByDateAndStaff }