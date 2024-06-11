const Member = require('../models/member');
const Promise = require('../models/promise');
const SeniorProfile = require('../models/seniorProfile');
const Report = require("../models/report");
const Matching = require('../models/matching');
const StudentProfile = require("../models/studentProfile");
const { Op } = require('sequelize');
const multer = require('multer');

exports.showReportForm = async (req, res) => {
    try {
        console.log("Report render process started.");

        const userID = req.session.userID;
        const user = await Member.findOne({ where: { memberNum: userID } });

        if (!user) {
            return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자의 회원 번호에 해당하는 약속을 찾습니다.
        const promise = await Promise.findOne({
            where: {
                [Op.or]: [
                    { stdNum: userID },
                    { protectorNum: userID }
                ]
            }
        });

        if (!promise) {
            return res.status(400).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);

        // 약속에 연결된 회원들의 이름을 가져옵니다.
        const student = await Member.findOne({ where: { memberNum: promise.stdNum } });
        const protector = await Member.findOne({ where: { memberNum: promise.protectorNum } });
        const senior = await SeniorProfile.findOne({ where: { seniorNum: promise.seniorNum } });

        if (!student || !protector || !senior) {
            return res.status(400).json({ error: '회원 정보를 찾을 수 없습니다.' });
        }

        // 보고서 작성 폼에 전달할 데이터를 구성합니다.
        const reportFormData = {
            promiseNum: promise.promiseNum,
            studentNum: promise.stdNum,
            protectorNum: promise.protectorNum,
            seniorNum: promise.seniorNum,
            studentName: student.name,
            protectorName: protector.name,
            seniorName: senior.seniorName,
            promiseDate: promise.promiseCreationDate,
            startTime: promise.startTime
        };

        res.render('report', { reportFormData });
    } catch (error) {
        console.error('Error fetching promise with member name:', error);
        res.status(500).json({ error: '약속과 회원 이름을 가져오는 중 오류가 발생했습니다.' });
    }
};
exports.submitReport = async (req, res) => {
    try {
        const { reportContent, seniorNum, stdNum } = req.body;
        const reportMedia = req.file;

        const newReport = await Report.create({
            reportContent: reportContent,
            reportMedia: reportMedia,
            seniorNum: seniorNum,
            stdNum: stdNum
        });

        // 매칭 테이블에 보고서 번호 업데이트
        await Matching.update(
            { reportNum: newReport.reportNum },
            { where: { seniorNum: seniorNum, stdNum: stdNum } }
        );

        
        res.redirect('/reportList');
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: 'Report submission failed' });
    }
};
exports.listReports = async (req, res) => {
    try {
        const userID = req.session.userID; // 세션에서 사용자 ID를 가져옴

        if (!userID) {
            return res.status(401).json({ error: '사용자가 로그인하지 않았습니다.' });
        }

        // 사용자가 학생이거나 노인인 보고서를 가져옴
        const reports = await Report.findAll({
            where: {
                [Op.or]: [
                    { stdNum: userID },
                    { seniorNum: userID }
                ]
            }
        });

        res.render('reportList', { reports: reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
exports.viewReport = async (req, res) => {
    try {
        // 보고서 ID를 가져옵니다.
        const reportNum = req.params.reportNum;

        // 보고서 테이블에서 해당 ID의 보고서를 조회합니다.
        const report = await Report.findOne({ where: { reportNum: reportNum } });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

      
        const base64Image = Buffer.from(report.reportMedia, 'binary').toString('base64');

        // 학생 정보를 조회
        const student = await Member.findOne({ where: { memberNum: report.stdNum } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // 노인 정보를 조회
        const senior = await SeniorProfile.findOne({ where: { seniorNum: report.seniorNum } });
        if (!senior) {
            return res.status(404).json({ error: 'Senior not found' });
        }

        // HTML 템플릿을 렌더링할 때, 인코딩된 이미지 데이터를 전달합니다.
        res.render('reportDetail', { report: report, student: student, senior: senior, base64Image: base64Image });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};



exports.renderReportListPage = async (req, res) => {
    try {
        // 보고서 목록을 가져오는 로직
        const reports = await Report.findAll();
        // 보고서 목록 페이지를 렌더링하고 데이터를 전달
        res.render('reportList', { reports: reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
/*
exports.showReportForm = async (req, res) => {
    try {
        console.log("Report render process started.");

        const userID = req.session.userID;
        const user = await Member.findOne({ where: { memberNum: userID } });

        if (!user) {
            return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자의 회원 번호에 해당하는 약속을 찾습니다.
        const promise = await Promise.findOne({
            where: {
                [Op.or]: [
                    { stdNum: userID },
                    { protectorNum: userID }
                ]
            }
        });

        if (!promise) {
            return res.status(400).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);

        // 약속에 연결된 회원들의 이름을 가져옵니다.
        const student = await Member.findOne({ where: { memberNum: promise.stdNum } });
        const protector = await Member.findOne({ where: { memberNum: promise.protectorNum } });
        const senior = await SeniorProfile.findOne({ where: { seniorNum: promise.seniorNum } });

        if (!student || !protector || !senior) {
            return res.status(400).json({ error: '회원 정보를 찾을 수 없습니다.' });
        }

        // 보고서 작성 폼에 전달할 데이터를 구성합니다.
        const reportFormData = {
            promiseNum: promise.promiseNum,
            studentNum: promise.stdNum,
            protectorNum: promise.protectorNum,
            seniorNum: promise.seniorNum,
            studentName: student.name,
            protectorName: protector.name,
            seniorName: senior.seniorName,
            promiseDate: promise.promiseCreationDate,
            startTime: promise.startTime
        };

        res.render('report', { reportFormData });
    } catch (error) {
        console.error('Error fetching promise with member name:', error);
        res.status(500).json({ error: '약속과 회원 이름을 가져오는 중 오류가 발생했습니다.' });
    }
};
/*
exports.submitReport = async (req, res) => {
    try {
        console.log("Report creation process started.");

        const { stdNum, seniorNum, reportContent } = req.body;
        const reportMedia = req.file; // 파일 업로드를 통해 받은 이미지 데이터

        // 보고서 데이터를 저장합니다.
        const report = await Report.create({
            reportContent: reportContent,
            reportMedia: reportMedia,
            seniorNum: seniorNum,
            stdNum: stdNum
        });

        console.log("Report submitted:", report);
        

        res.status(200).json({ message: '보고서가 성공적으로 제출되었습니다.' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: '보고서를 제출하는 중 오류가 발생했습니다.' });
    }
};

exports.submitReport = async (req, res) => {
    try {
        console.log("Report creation process started.");

        const { stdNum, seniorNum, reportContent } = req.body;
        const reportMedia = req.file; // 파일 업로드를 통해 받은 이미지 데이터

        // 보고서 데이터를 저장합니다.
        const report = await Report.create({
            reportContent: reportContent,
            reportMedia: reportMedia,
            seniorNum: seniorNum,
            stdNum: stdNum
        });

        console.log("Report submitted:", report);
        // 매칭 테이블에 보고서 번호 업데이트
        await Matching.update(
            { reportNum: newReport.reportNum },
            { where: { seniorNum: seniorNum, stdNum: stdNum } }
        );
        // 보고서가 성공적으로 제출되었음을 JSON 응답으로 알린 후에 보고서 목록 페이지로 넘어갑니다.
        res.redirect(`/reportDetail/${report.reportNum}`);

    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ error: '보고서를 제출하는 중 오류가 발생했습니다.' });
    }
};

exports.renderReportListPage = async (req, res) => {
    try {
        // 데이터베이스에서 보고서 목록을 가져오는 로직
        const fetchedReports = await Report.findAll();
        
        // 보고서 목록을 렌더링할 때 사용할 데이터
        const reportListData = fetchedReports.map(report => {
            return {
                reportNum: report.reportNum,
                reportContent: report.reportContent,
                reportMedia: report.reportMedia,
                seniorNum: report.seniorNum,
                stdNum: report.stdNum
                // 필요한 경우 더 많은 데이터 추가
            };
        });

        // 보고서 목록 페이지를 렌더링하고 데이터를 전달
        res.render('reportList', { reports: reportListData }); // 보고서 목록 페이지 렌더링 확인
    } catch (error) {
        console.error('보고서 목록 페이지 렌더링 중 오류:', error);
        res.status(500).send('보고서 목록을 가져오는 중 오류가 발생했습니다.');
    }
};
exports.getReportDetail = async (req, res) => {
    try {
        const reportNum = req.params.reportNum;
        console.log('보고서 번호:', reportNum);

        // 보고서 번호에 해당하는 보고서 정보를 조회
        const report = await Report.findOne({ where: { reportNum: reportNum } });
        if (!report) {
            console.log('보고서를 찾을 수 없습니다.');
            return res.status(404).send('보고서를 찾을 수 없습니다.');
        }

        // 보고서에 연결된 약속 번호를 가져옵니다.
        const promiseNum = report.promiseNum;
        console.log('보고서에 연결된 약속 번호:', promiseNum);

        // 약속 정보를 조회
        const promise = await Promise.findOne({ where: { promiseNum: promiseNum } });
        if (!promise) {
            console.log('약속 정보를 찾을 수 없습니다.');
            return res.status(404).send('약속 정보를 찾을 수 없습니다.');
        }

        // 보호자 정보를 조회
        const protector = await Member.findOne({ where: { memberNum: report.protectorNum } });
        if (!protector) {
            console.log('보호자 정보를 찾을 수 없습니다.');
            return res.status(404).send('보호자 정보를 찾을 수 없습니다.');
        }

        // 학생 정보를 조회
        const student = await Member.findOne({ where: { memberNum: report.stdNum } });
        if (!student) {
            console.log('학생 정보를 찾을 수 없습니다.');
            return res.status(404).send('학생 정보를 찾을 수 없습니다.');
        }

        // 보고서 상세 페이지에 필요한 정보를 전달하여 렌더링
        res.render('reportDetail', { 
            report: report,
            promise: promise,
            protector: protector,
            student: student
        });
    } catch (error) {
        console.error('보고서 상세 페이지 렌더링 중 오류:', error);
        res.status(500).send('보고서 상세 페이지 렌더링 중 오류가 발생했습니다.');


    }
};
 */