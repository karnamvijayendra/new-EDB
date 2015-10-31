package com.acc.tools.ed.integration.dao;

import javax.servlet.http.HttpServletResponse;

public interface ProjectReportDao {



	public void generateReport(String projectName, String releaseName,
			HttpServletResponse response, String startDate, String endDate,
			String status,String reportFormat);

	public void generateMasterReport(HttpServletResponse response,String startDate,String endDate,String reportFormat,String reportName);
	
	public void generateDMSReport(HttpServletResponse response,String programName,String projectName,String releaseName,String weekStartDate,String weekEndDate);

}
