const Member = require('../models/member');
const Promise = require('../models/promise');
const SeniorProfile = require('../models/seniorProfile');
const Report = require("../models/report");
const Matching = require('../models/matching');
const StudentProfile = require("../models/studentProfile");
const { Op } = require('sequelize');
const multer = require('multer');
const sequelize = require('../config/database');

async function fetchData(reportNum) {
    try {
        const report = await Report.findOne({ where: { reportNum } });
        return report;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


exports.showReportForm = async (req, res) => {
    try {
        const promiseNum = req.query.promiseNum;
        const userID = req.session.userID;

        if (!promiseNum) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const promise = await Promise.findOne({
            where: {
                promiseNum: promiseNum,
                stdNum: userID
            }
        });

        if (!promise) {
            return res.status(400).json({ error: 'Promise not found' });
        }

        const student = await Member.findOne({ where: { memberNum: promise.stdNum } });
        const senior = await SeniorProfile.findOne({ where: { seniorNum: promise.protectorNum } });

        if (!student || !senior) {
            return res.status(400).json({ error: 'Related members not found' });
        }

        const promiseDetails = {
            promiseNum: promise.promiseNum,
            studentNum: promise.stdNum,
            protectorNum: promise.protectorNum,
            seniorNum: promise.protectorNum,
            studentName: student.name,
            seniorName: senior.seniorName,
            promiseDate: promise.promiseCreationDate,
            startTime: promise.startTime
        };

        res.render('reportForm', { promiseDetails });
    } catch (error) {
        console.error('Error fetching promise details:', error);
        res.status(500).json({ error: 'Error fetching promise details' });
    }
};


exports.submitReport = async (req, res) => {
    try {
        const { reportContent, seniorNum, stdNum, promiseNum } = req.body;
        const reportMedia = req.file;

        const newReport = await Report.create({
            reportContent: reportContent,
            reportMedia: reportMedia.buffer,
            seniorNum: seniorNum,
            stdNum: stdNum
        });

        await Matching.update(
            { reportNum: newReport.reportNum, reportStatus: true },
            { where: { promiseNum: promiseNum } }
        );

        res.redirect('/reportList');
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Report submission failed' });
    }
};




exports.listReports = async (req, res) => {
    try {
        const userID = req.session.userID;

        if (!userID) {
            return res.status(401).json({ error: '사용자가 로그인하지 않았습니다.' });
        }

        const userType = req.session.userType;

        if (userType === 'student') {
            const reports = await Report.findAll({
                where: {
                    stdNum: userID
                }
            });

            res.render('reportListStudent', { reports });
        } else if (userType === 'senior') {
            const reports = await Report.findAll({
                where: {
                    seniorNum: userID
                }
            });

            res.render('reportListSenior', { reports });
        } else {
            return res.status(400).json({ error: '알 수 없는 사용자 유형입니다.' });
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

exports.viewReport = async (req, res) => {
    try {
        const reportNum = req.params.reportNum;
        const report = await Report.findOne({ where: { reportNum } });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const base64Image = Buffer.from(report.reportMedia, 'binary').toString('base64');

        const student = await Member.findOne({ where: { memberNum: report.stdNum } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const senior = await SeniorProfile.findOne({ where: { seniorNum: report.seniorNum } });
        if (!senior) {
            return res.status(404).json({ error: 'Senior not found' });
        }

        const promise = await Promise.findOne({ where: { stdNum: report.stdNum, protectorNum: report.seniorNum } });
        if (!promise) {
            return res.status(404).json({ error: 'Promise not found' });
        }

        res.render('reportDetail', {
            report: report,
            student: student,
            senior: senior,
            base64Image: base64Image,
            user: req.session.user,
            promiseDay: promise.promiseDay,
            startTime: promise.startTime,
            finishTime: promise.finishTime
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};


exports.pendingReports = async (req, res) => {
    try {
        const userID = req.session.userID;

        const pendingReports = await Matching.findAll({
            where: {
                reportStatus: false,
                '$Promise.stdNum$': userID
            },
            include: [
                {
                    model: Promise,
                    required: true
                }
            ]
        });

        const reports = [];
        for (const pendingReport of pendingReports) {
            const student = await StudentProfile.findOne({ where: { stdNum: pendingReport.Promise.stdNum } });
            const senior = await SeniorProfile.findOne({ where: { seniorNum: pendingReport.Promise.protectorNum } });

            reports.push({
                matchingNum: pendingReport.matchingNum,
                promiseNum: pendingReport.promiseNum,
                studentName: student ? student.name : 'Unknown',
                seniorName: senior ? senior.seniorName : 'Unknown'
            });
        }

        res.render('pendingReports', { reports });
    } catch (error) {
        console.error('Error fetching pending reports:', error);
        res.status(500).json({ error: 'Pending reports could not be fetched.' });
    }
};



exports.renderReportListPage = async (req, res) => {
    try {
        const userID = req.session.userID;
        const userType = req.session.userType;

        if (userType === 'student') {
            const reports = await Report.findAll({ where: { stdNum: userID } });
            res.render('reportListStudent', { reports });
        } else if (userType === 'senior') {
            const reports = await Report.findAll({ where: { seniorNum: userID } });
            res.render('reportListSenior', { reports });
        } else {
            res.status(400).json({ error: '알 수 없는 사용자 유형입니다.' });
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

exports.confirmReport = async (req, res) => {
    try {
        const reportNum = req.params.reportNum;
        const report = await Report.findOne({ where: { reportNum } });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const studentProfile = await StudentProfile.findOne({ where: { stdNum: report.stdNum } });
        const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: report.seniorNum } });

        if (!studentProfile || !seniorProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        console.log('Incrementing matching count for student and senior');

        // 학생과 노인의 매칭 카운트 증가
        await studentProfile.increment('matchingCount');
        await seniorProfile.increment('matchingCount');

        // 보고서 상태 업데이트 및 updatedAt 필드 갱신
        report.reportStatus = true;
        report.updatedAt = new Date(); // 현재 시간을 updatedAt 필드에 설정
        await report.save();

        res.json({ message: 'Report confirmed and matching count updated.' });
    } catch (error) {
        console.error('Error confirming report:', error);
        res.status(500).json({ error: 'Failed to confirm report' });
    }
};