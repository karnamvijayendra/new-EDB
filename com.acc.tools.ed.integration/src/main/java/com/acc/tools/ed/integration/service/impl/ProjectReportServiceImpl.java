package com.acc.tools.ed.integration.service.impl;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.acc.tools.ed.integration.service.ProjectReportService;
import com.acc.tools.ed.integration.dao.ProjectReportDao;

@Service("ProjectReportService")
public class ProjectReportServiceImpl implements ProjectReportService{

	private static final Logger LOG = LoggerFactory.getLogger(ProjectReportServiceImpl.class);

	@Autowired
	private ProjectReportDao projectReportDao;


	public void generateReport(String projectName, String releaseName,HttpServletResponse response,String startDate,String endDate,String status,String reportFormat)

	{
		try{
			System.out.println("passing the values from impl");
			projectReportDao.generateReport(projectName, releaseName, response, startDate, endDate,status,reportFormat);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	

	public void generateMasterReport(HttpServletResponse response,String startDate,String endDate,String reportFormat,String reportName)

	{
	try{
		System.out.println("passing the values from impl");
		projectReportDao.generateMasterReport(response, startDate, endDate, reportFormat, reportName);
	}
	catch(Exception e)
	{
		e.printStackTrace();
	}
}
	
	public void generateDMSReport(HttpServletResponse response,String programName,String projectName,String releaseName,String weekStartDate,String weekEndDate){
		try{
			System.out.println("passing the values from impl");
			projectReportDao.generateDMSReport(response,programName,projectName,releaseName,weekStartDate,weekEndDate);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}