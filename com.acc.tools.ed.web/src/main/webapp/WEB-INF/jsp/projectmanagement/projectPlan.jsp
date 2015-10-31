<%@ include file="/WEB-INF/jsp/includes/document-header.jsp"%>
<script src="<%=request.getContextPath()%>/script/projectmanagement-actions.js"></script>

<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
	<table class="ebdtableheader">
		<tr>
			<th>Project Name</th>
			<td>
				<select id="projects" class="textbox">
					<option value="0">Select Project</option>
				    <c:forEach items="${projectList}" var="project">
				        <option value="${project.id}" <c:if test="${project.selected==true}">selected</c:if>>${project.label}</option>
				    </c:forEach>
				</select>
			</td>
			<td><a href="#" class="button" id="addProject" style="width: 100px;">Add Project</a></td>
			<td><a href="#" class="button" id="editProject" style="width: 100px;">Edit Project</a></td>
			<td><a href="#" class="button" id="deleteProject" style="width: 100px;">Delete Project</a></td>
			<td style="background-image: none;background-color: white;border-width: 1px;border-style: solid;border-color: #999999;"><div style="width: 15px;"></div></td>
			<th>Release Name</th>
			<td>
				<select id="releases" class="textbox">
					<option  value="0">Select Release</option>
	 					<c:forEach items="${releaseList}" var="release">
					        <option value="${release.id}" <c:if test="${release.selected==true}">selected</c:if> >${release.label}</option>
					    </c:forEach>					
				</select>
			</td>
			<td><a href="#" class="button" id="addRelease" style="width: 100px;">Add Release</a></td>
			<td><a href="#" class="button" id="editRelease" style="width: 100px;">Edit Release</a></td>
			<td><a href="#" class="button" id="deleteRelease" style="width: 100px;">Delete Release</a></td>
			<td><a href="#" class="button" id="viewProjectPlan" style="width: 100px;"> View Project Plan</a></td>
		</tr>
	</table>
	<div id="viewProjectAndReleaseDetails"><!-- Project and Release View -->
		<div class="boxmsg border-boxmsg" style="width: 700px;color: red;">
		    Please select <u>Project</u> and <u>Release</u> from the drop down above to view the project plan. <br>
		    If no projects and release are configured then please add new Project using <u>"Add Project"</u> button
		    and new Release using <u>"Add Release"</u> button.
		    <b class="border-notch notch"></b>
		    <b class="notch"></b>
		</div>
	</div>
	<div id="deleteProject-confirm" title="Empty the recycle bin?">
  		<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span><div id="projectNameId"></div></p>
	</div>
