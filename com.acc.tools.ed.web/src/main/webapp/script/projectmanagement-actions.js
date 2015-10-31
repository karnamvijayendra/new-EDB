$(document).ready(function(){
	
							/*Start -> Page refresh F5 disabled*/
			/*				function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };
						
							$(document).ready(function(){
							     $(document).on("keydown", disableF5);
							});*/
	
							/*END -> Page refresh F5 disabled*/
							
							$("#projectName").blur(function(){
					    	var progId=$("#existingProgram option:selected").val();
							var projectName = $("#projectName").val();
					    	$.ajax({
								type : "GET",
								url : "./checkProjName.do",
								dataType:'json',
								data : {
									projectName : projectName,
									progId : progId
								},
								success : function(response) {
									if(response == 0){
										document.getElementById("display").innerHTML = "Program already Exists";
										$("#projectName").val('');
										$("#projectName").focus();
									}else{
										document.getElementById("display").innerHTML = "";
									}
								},
								error : function(data) {	
									alert('Application error! Please call help desk.');
									$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
								}
								
							});	
					    });

						
						/*
						 * Date Format :yyyy-mm-dd
						 */
						Date.prototype.yyyymmdd = function() {         
					        
					        var yyyy = this.getFullYear().toString();                                    
					        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
					        var dd  = this.getDate().toString();             
					                            
					        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
					   }; 
					   
						/**
						 * Activate subtab1 on main tab 'Project Plan' active
						 */
						$('#subtab1').parent().addClass('subtab-active');
						$('#subtab1').css({
							"pointer-events": "none",
							"cursor": "default"
						});
						
						/*
						 * Add New Project Dialog box
						 */
						var addProjectDialog = $("#addproject-popup").dialog({
							autoOpen : false,
							height : 550,
							width : 700,
							modal : true,
							buttons : {
								"Add Project" : function() { 
									
									var progName=$("#existingProgram option:selected").text();
									var progId=$("#existingProgram option:selected").val();
									var projectName = $("#projectName").val();
									var newProgramName = $("#newProgramName").val();
									var projectLead = $("#projectLead").val();
									var progName1=$(progName).val();
									var startDate = $("#startDate").val();
									var projectDescription = $('#projectDescription').val();
									var list = new Array();
									$('#existingProgram option').each( function() {
										if($(this).val() != 0 && $(this).val() != -1){
											list.push($(this).text());
										}
									});
									if(progId == 0){alert("Please select Program!");$("#existingProgram").focus();return false;}
									if(progId == -1 && $("#newProgramName").val() == ''){
										alert("Please Enter New Program!"); 
										$("#newProgramName").focus();return false
									}
									if (jQuery.inArray(newProgramName, list) == 0) {alert("Program already exist!");$("#newProgramName").val('');$("#newProgramName").focus();return false;}
									
									
									if(projectName == ''){alert("Please Enter project Name!");$("#projectName").focus();document.getElementById("display").innerHTML = "";return false;	}
									
									
									if(projectLead == 0){alert("Please Select Lead!");$("#projectLead").focus();return false;}
									if(startDate == ''){alert("Please Enter Start Date!");$("#startDate").focus();return false;}
									if(projectDescription == ''){alert("Please Enter Project Description !");$("#projectDescription").focus();return false;}
									
									
									if(!$("#selectedResources1 option").length) {
										  alert('Please add atleast one resource');
										  $("#selectedResources1").focus();
										  return false
									}
									
									if($("#selectedResources1 option").length == 0){
										alert("Please choose selected resource to submit ");$("#selectedResources1").focus();return false;
									} else {
										$("#selectedResources1 option").each(function(i){
									        $(this).prop("selected",true);
									    });										
									}
									
									if($("#newProgramName:empty").length > 0 && $("#existingProgram").val()=='-1'){
										var newProgramId=generateId("existingProgram")+1;
										$("#newProgramId").val(newProgramId);
									}
									var newProjectId=generateId("projects")+1;
									$("#projectId").val(newProjectId);
									var phaseCheck = false;
									$("input[id^='listphase']").each(function() {
										if($(this).prop('checked')){
										   phaseCheck = true;
									   }
									});
									if(phaseCheck == false){
										alert("Select atleast one project phase");
										return false
									}
									if($("#projectStartDate").val() == ''){
										alert("Please select start date");return false
									}
									if($("#projectEndDate").val() == ''){
										alert("Please select end date");return false
									}

									$("#addProjectForm").submit();																		
									
									},
								Cancel : function() {
									addProjectDialog.dialog("close");
									fnRemoveDuplicates();
								},
							},

						});

						$('#addproject-popup').bind('dialogclose', function(event) { fnRemoveDuplicates(); });

					    var deleteProjectConfirm=$( "#deleteProject-confirm" ).dialog({
					    	autoOpen : false,
					        height:150,
					        width:600,
					        modal: true,
					        buttons: {
					          "Delete Project": function() {
					        	  var projectId=$("#projects").val();
									$.ajax({
										type : "POST",
										url : "./deleteProject.do",
										data :{projectId:projectId} ,												
										dataType : 'json',		
										beforeSend:function(){
										  },
										success : function(response) {
											deleteProjectConfirm.dialog("close");
											if(response.errorCode==0){
												$('#projects option[value="'+projectId+'"]').remove();
											}
											alert(response.message);
										},
										error : function(data) {	
											alert("Application error! Please call help desk. Error:"+data.error);
										}
									});	
					          },
					          Cancel: function() {
					        	  deleteProjectConfirm.dialog( "close" );
					          }
					        }
					      });
						$("#deleteProject").button().unbind("click").on("click", function() {
							var projectName=$("#projects option:selected").text();
							if(projectName == "Select Project"){
								alert('Please select Project to Delete');
								return false;
							} else {
								$("#projectNameId").html(projectName+" project will be permanently deleted and cannot be recovered.<br> Are you sure?");
								deleteProjectConfirm.dialog("open");
							}
						});
						
						var editProjectDialog = $("#editproject-popup").dialog({
							autoOpen : false,
							height : 550,
							width : 650,
							modal : true,
							buttons : {
								"Edit Project" : function() { 
									
									var progName=$("#existingProgramEdit option:selected").text();
									var progId=$("#existingProgramEdit option:selected").val();
									var newProgramName = $("#newProgramName").val();
									var projectName = $("#projectNameEdit").val();
									var projectLead = $("#projectLeadEdit").val();
									var progName1=$(progName).val();
									var startDate = $("#startDateEdit").val();
									var projectDescription = $('#projectDescriptionEdit').val();
									var list = new Array();
									
									
									
									$('#existingProgram option').each( function() {
										if($(this).val() != 0 && $(this).val() != -1){
											list.push($(this).text());
										}
									});
									if(progId == 0){alert("Please select Program!");$("#existingProgram").focus();return false;}
									if(progId == -1 && $("#newProgramName").val() == ''){
										alert("Please Enter New Program!"); 
										$("#newProgramName").focus();return false
									}
									if (jQuery.inArray(newProgramName, list) == 0) {alert("Program already exist!");$("#newProgramName").val('');$("#newProgramName").focus();return false;}
									
									
									if(projectName == ''){alert("Please Enter project Name!");$("#projectName").focus();return false;	}
									if(projectLead == 0){alert("Please Select Lead!");$("#projectLead").focus();return false;}
									if(startDate == ''){alert("Please Enter Start Date!");$("#startDate").focus();return false;}
									if(projectDescription == ''){alert("Please Enter Project Description !");$("#projectDescription").focus();return false;}
									
									if($("#selectedResourcesEdit option").length == 0){
										alert("Please choose atleast one resource ");$("#selectedResourcesEdit").focus();return false;
									}else {
										$("#selectedResourcesEdit option").each(function(i){
									        $(this).prop("selected",true);
									    });										
									}
									
									if($("#newProgramName:empty").length > 0 && $("#existingProgram").val()=='-1'){
										var newProgramId=generateId("existingProgram")+1;
										$("#newProgramId").val(newProgramId);
									}
									var newProjectId=generateId("projects")+1;
									$("#projectId").val(newProjectId);
									var phaseCheck = false;
									$("input[id^='phasesEdit']").each(function() {
										if($(this).prop('checked')){
										   phaseCheck = true;
									   }
									});
									if(phaseCheck == false){
										alert("Select atleast one project phase");
										return false
									}
									if($("#endDateEdit").val() == ''){
										alert("Please select end date");return false
									}
									$("#editProjectForm").submit();																		
									editProjectDialog.dialog("close");
									},
								Cancel : function() {
									editProjectDialog.dialog("close");
								},
							},

						});
						
						$("#editProject").button().unbind("click").on("click", function() {
							
							var projectId = $("#projects option:selected").val(); 
							if($("#projects option:selected").val() == 0){
								alert('Please select Project to Edit');
								$("#projects").focus();
								return false;
							}
							$.ajax({
								url : "./viewProjectDetails.do",
								dataType:'json',
								data : {projectId : projectId},
								success : function(response) {
									var programId;
									var projectLeadId;
									$.each(response, function(outerKey, outerValue){
										
									   if(outerKey=='resourceList'){
										   $('#stringResourcesEdit option').remove();
										    $.each(outerValue, function(key, value){
										       $('#stringResourcesEdit').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   if(outerKey=='programList'){
										   $('#existingProgramEdit option').remove();
										    $.each(outerValue, function(key, value){
										    	$('#existingProgramEdit').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   if(outerKey=='projectLeadList'){
										   $('#projectLeadEdit option').remove();
										    $.each(outerValue, function(key, value){
										    	
										       $('#projectLeadEdit').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   if(outerKey == 'projectDetails'){
										   $('#selectedResourcesEdit option').remove();
											   for(var emp in outerValue.resources){
												   $('#selectedResourcesEdit').append('<option selected="selected" value="'+outerValue.resources[emp].id+'">'+outerValue.resources[emp].label+'</option>');
											   }
											   $("#projectIdEdit").val(outerValue.projectId);
											   $('#projectDescriptionEdit').val(outerValue.projectDescription);
											   $('#startDateEdit').val(outerValue.startDate);
											   $('#endDateEdit').val(outerValue.endDate);
											   $('#projectNameEdit').val(outerValue.projectName);
											   
											   programId = outerValue.newProgramName;
											   projectLeadId = outerValue.projectLead;
											   
											   //$('#existingProgramEdit').append('<option selected="selected" value="'+outerValue.existingProgram+'">'+outerValue.newProgramName+'</option>');
											   //$("#projectLeadEdit option:selected").text(outerValue.projectLead);
											   
											   
											   var listPhase = outerValue.phases.toString().replace(/\[+(.*?)\]+/g,"$1");
											   
											   $("input[id^='phasesEdit']").each(function() {
												   
												   if (jQuery.inArray(this.value, listPhase) != -1) {
													   $(this).attr("checked", true);
												   }else {
													   $(this).attr("checked", false);
												   }
												   
											   });
									   }
									});
									
									$("#existingProgramEdit option").map(function () {
									   if ($(this).text() == programId) return this;
						            }).attr('selected', 'selected');
								
									$("#projectLeadEdit option").map(function () {
						                if ($(this).val() == projectLeadId) return this;
						            }).attr('selected', 'selected');
								  
									$( "#startDateEdit" ).datepicker({
										showOn: 'button',
										buttonText: 'Show Date',
										buttonImageOnly: true,
										buttonImage: 'resources/cal.gif',
										dateFormat: 'mm/dd/yy',
										constrainInput: true
									 });
									

									$( "#endDateEdit" ).datepicker({
										showOn: 'button',
										buttonText: 'Show Date',
										buttonImageOnly: true,
										buttonImage: 'resources/cal.gif',
									 });
									editProjectDialog.dialog("open");
								},
								error : function(data) {	
									alert("Application error! Please call help desk. Error:"+data.status);
								}
							});	
						
						});
						
						$( "#projectStartDate" ).datepicker({
							showOn: 'button',
							buttonText: 'Show Date',
							buttonImageOnly: true,
							buttonImage: 'resources/cal.gif',
							dateFormat: 'mm/dd/yy',
							constrainInput: true
						 });
						$( "#projectEndDate" ).datepicker({
							showOn: 'button',
							buttonText: 'Show Date',
							buttonImageOnly: true,
							buttonImage: 'resources/cal.gif',
							dateFormat: 'mm/dd/yy',
							constrainInput: true
						 });
						
						$("#addProject").button().unbind("click").on("click", function() {
							fnReset();
							if($("#projects option:selected").val() != 0){
								alert('If you choose projects go for Edit Project !!! ');
								$("#projects").val(0);
								return false;
							}
							$.ajax({
								type : "GET",
								url : "./fetchInitialProjectSetupDetails.do",
								dataType:'json',
								success : function(response) {
									$('#stringResources').empty();
									$('#selectedResources1').empty();
									$('#projectStartDate').val('');
									$('#projectEndDate').val('');
									$.each(response, function(outerKey, outerValue){
									   if(outerKey=='resourceList'){
										    $.each(outerValue, function(key, value){
										       $('#stringResources').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   if(outerKey=='programList'){
										    $.each(outerValue, function(key, value){
										       $('#existingProgram').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   if(outerKey=='projectLeadList'){
										    $.each(outerValue, function(key, value){
										       $('#projectLead').append('<option value="'+value.id+'">'+value.label+'</option>');
										    });
									   }
									   
									});
									$("#newProgramName").val("");
									
									addProjectDialog.dialog("open");
								},
								error : function(data) {	
									$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
								}
							});	
						
						});
						
						
						/*
						 * Add New Release Dialog box
						 */
						var addReleaseDialog = $("#addrelease-popup").dialog({
							autoOpen : false,
							height : 720,
							width : 1100,
							modal : true,
							buttons : {
								"Add Release" : function() { 
									var flag = true;
									$('input[type=text][id*=resDayHour]').each(function(){
										var val = $(this).val().toUpperCase();
										if(!/^\d+$/.test($(this).val()) && (val != 'V' && val != 'P' && val != 'I')){
											flag = false;
											alert("Please provide valid entry of hours");
											$(this).focus();
											return false;
										}
									});
									
									if(flag){
										var releaseName=$("#releaseName").val();
										var relStartDate=$("#releaseStartDate").val();
										var relEndDate=$("#releaseEndDate").val();
										var relArti=$("#releaseArtifacts").val();
										var relPlan = $('#addReleasePlan').html();
										if(releaseName=='' || relStartDate=='' || relEndDate=='' || relArti==''){
											alert("Missing Required Values!")
											return false;
											
										} else if (relPlan=='') {
											alert("Missing Release Plan!")
											return false;
										}
										
										var releaseIdCount=generateId("releases")+1;
										var projectId=$("#projectId").val();
										var releaseForm = $('#addReleaseForm').serializeArray();
										var resources = $("input[id^='resource']").length;
										var jsonString = "{";
										$.each(releaseForm,
											    function(i, v) {
													 if(v.name=="releaseStartDate" || v.name=="releaseEndDate"){																															
														jsonString=jsonString+" \""+v.name+"\":\""+v.value+"\",";
													 } else {
														jsonString=jsonString+" \""+v.name+"\":\""+v.value+"\",";
													 }
											 });
											jsonString=jsonString+"\"resourcesAndWorkHours\" : {";
											
											for(var i=0; i<resources;i++){		
												var resourceId=$("#resource"+i).val();
												if (typeof resourceId != 'undefined') {
													jsonString=jsonString+"\""+resourceId+"\": {";
													$("input[id^='resDayHour']").each(function(index, obj){
														var day=obj.id.split("_")[1];
														if(obj.id.indexOf("resDayHour"+i)==0){
															var val = obj.value;
															if(val == 'V'){
																val = -1;
															}else if(val == 'I'){
																val = -2;
															}else if(val == 'P'){
																val = -3;
															}
															jsonString=jsonString+"\""+day+"\":"+val+",";
														}
													});
													jsonString=jsonString.substring(0,jsonString.lastIndexOf(","));
													jsonString=jsonString+"},";
												};
											}
											jsonString=jsonString.substring(0,jsonString.lastIndexOf(","))+"},";

											jsonString=jsonString+"\"releaseId\":\""+releaseIdCount+"\",";
											jsonString=jsonString+"\"projectId\":\""+projectId+"\"";
											jsonString=jsonString+"}";
										
										
										$.ajax({
											type : "POST",
											url : "./addRelease.do",
											data :jsonString ,												
											contentType : 'application/json; charset=utf-8',
											dataType : 'json',		
											beforeSend:function(){
												
												
											  },
											success : function(response) {
												//$('#releases').append('<option selected value="'+response.id+'">'+response.label+'</option>').change();
												
												addReleaseDialog.dialog("close");
												alert("Release details added successfully!!!");
												var url=$('#contextPath').val();
												window.location.href=url+'login.do';
												/*$("#mainBody .subtabs").attr("id","pm1");
												$("#mainBody .subtabs").attr("action","./login.do");
												$("#mainBody .subtabs").get(0).click();*/
											},
											error : function(data) {	
												$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
											}
										});
									}
								},
								Cancel : function() {
									addReleaseDialog.dialog("close");
								}
							},

						});
						
						var editReleaseDialog = $("#editrelease-popup").dialog({
							autoOpen : false,
							height : 700,
							width : 1100,
							modal : true,
							buttons : {
								"Edit Release" : function() {
									var flag = true;
									$('input[type=text][id*=resDayHour]').each(function(){
										var val = $(this).val().toUpperCase();
										if(!/^\d+$/.test($(this).val()) && (val != 'V' && val != 'P' && val != 'I')){
											flag = false;
											alert("Please provide valid entry of hours");
											$(this).focus();
											return false;
										}
									});
									if(flag){
										var projectId=$("#projects").val();
										var releaseId = $("#releases option:selected").val();
										var releaseForm = $('#editReleaseForm').serializeArray();
										var resources = $("input[id^='resource']").length;
										var jsonString = "{";
										$.each(releaseForm,
										    function(i, v) {
												 if(v.name=="releaseStartDate" || v.name=="releaseEndDate"){																															
													jsonString=jsonString+" \""+v.name+"\":\""+v.value+"\",";
												 } else {
													jsonString=jsonString+" \""+v.name+"\":\""+v.value+"\",";
												 }
										 });
										jsonString=jsonString+"\"resourcesAndWorkHours\" : {";
										
										for(var i=0; i<resources;i++){		
											var resourceId=$("#resource"+i).val();
											if (typeof resourceId != 'undefined') {
												jsonString=jsonString+"\""+resourceId+"\": {";
												$("input[id^='resDayHour']").each(function(index, obj){
													var day=obj.id.split("_")[1];
													if(obj.id.indexOf("resDayHour"+i)==0){
														var val = obj.value;
														if(val == 'V'){
															val = -1;
														}else if(val == 'I'){
															val = -2;
														}else if(val == 'P'){
															val = -3;
														}
														jsonString=jsonString+"\""+day+"\":"+val+",";
													}
												});
												jsonString=jsonString.substring(0,jsonString.lastIndexOf(","));
												jsonString=jsonString+"},";
											};
										}
										jsonString=jsonString.substring(0,jsonString.lastIndexOf(","))+"},";

										jsonString=jsonString+"\"releaseId\":\""+releaseId+"\",";
										jsonString=jsonString+"\"projectId\":\""+projectId+"\"";
										jsonString=jsonString+"}";
										$.ajax({
											type : "POST",
											url : "./editRelease.do",
											data :jsonString ,												
											contentType : 'application/json; charset=utf-8',
											dataType : 'json',		
											beforeSend:function(){
											  },
											success : function(response) {
												editReleaseDialog.dialog("close");		
											},
											error : function(data) {	
												alert("Application error! Please call help desk. Error:"+data.status);
											}
										});
									}
								},
								Cancel : function() {
									editReleaseDialog.dialog("close");
								}
							},

						});
						
						
						$("#editRelease").button().unbind("click").on("click", function() {
							var releaseId = $("#releases option:selected").val();
							if(releaseId=="SR"){
								alert("Please select Release!");
							} else {
								$.ajax({
									type : "POST",
									url : "./getReleaseDetails.do",
									data :{releaseId:releaseId} ,												
									dataType : 'json',		
									beforeSend:function(){
									  },
									success : function(response) {
										var projectName="";
										var projStartDate="";
										var projEndDate="";
										var releaseName=""
										var relStartDate="";
										var relEndDate="";
										var relArti="";
										for(var field in response){
											if(field=="projectName"){
												projectName=response[field];
											} else if(field=="startDate"){
												projStartDate=response[field];
											} else if(field=="endDate"){
												projEndDate=response[field];
											} else if(field="release"){
												releaseName=response[field].releaseName;
												relStartDate=response[field].releaseStartDate;
												relEndDate=response[field].releaseEndDate;
												relArti=response[field].releaseArtifacts;
											}
										}
										
										$("#editProjName").html(projectName);
										$("#editProjStartDate").html(projStartDate);
										$("#editProjEndDate").html(projEndDate);	
										$("#editReleaseName").val(releaseName);
										$("#editReleaseStartDateId").val(relStartDate);
										$("#editReleaseEndDate").val(relEndDate);
										$("#editReleaseArtifacts").val(relArti);
										editReleaseDialog.dialog("open");
										$( "#editReleaseStartDateId" ).datepicker({
											showOn: 'button',
											buttonText: 'Show Date',
											buttonImageOnly: true,
											buttonImage: 'resources/cal.gif',
											dateFormat: 'mm/dd/yy',
											constrainInput: true,
											minDate:projStartDate,
											maxDate:projEndDate
										 }); 
										
										$( "#editReleaseEndDate" ).datepicker({
											showOn: 'button',
											buttonText: 'Show Date',
											buttonImageOnly: true,
											buttonImage: 'resources/cal.gif',
											dateFormat: 'mm/dd/yy',
											constrainInput: true,
											minDate:projStartDate,
											maxDate:projEndDate
										});
										$("#viewReleasePlan").html("");
										$('#addReleasePlan').html("");
										editReleaseDialog.dialog("open");		
									},
									error : function(data) {	
										alert("Application error! Please call help desk. Error:"+data.status);
									}
								});	
							}
						});

						$("#addRelease").button().unbind("click").on("click", function() {
							var prjName=$("#mainBody #projects option:selected").text();
							var projectId = $("#mainBody #projects").val();
							if(projectId=="0"){
								alert("Please select Project!");
							} else {
								$("#mainBody #projName").html(prjName);
								$("#mainBody #projectId").val(projectId);
								$.ajax({
									type : "POST",
									url : "./getPrjDate.do",
									data : {projectId:projectId},									
									dataType : 'json',		
									success : function(response) {
										var projStartDate=null;
										var projEndDate=null;
										$.each(response, function(projDateKey, projDateValue){
											
											if(projDateKey=='projectStartDate'){
												projStartDate=new Date(projDateValue);
												$("#mainBody #projStartDate").html(projDateValue);
											}
											if(projDateKey=='projectEndDate'){
												projEndDate=new Date(projDateValue);
												$("#mainBody #projEndDate").html(projDateValue);
											}
											
										});
										$( "#releaseStartDate" ).datepicker({
											showOn: 'button',
											buttonText: 'Show Date',
											buttonImageOnly: true,
											buttonImage: 'resources/cal.gif',
											dateFormat: 'mm/dd/yy',
											constrainInput: true,
											minDate:projStartDate,
											maxDate:projEndDate
										 }); 
										
										$( "#releaseEndDate" ).datepicker({
											showOn: 'button',
											buttonText: 'Show Date',
											buttonImageOnly: true,
											buttonImage: 'resources/cal.gif',
											dateFormat: 'mm/dd/yy',
											constrainInput: true,
											minDate:projStartDate,
											maxDate:projEndDate
										});
										
										$("#releaseName").val('');
										$("#releaseArtifacts").val('');
										$("#releaseStartDate").val('');
										$("#releaseEndDate").val('');
										$("#viewReleasePlan").html("");
										$('#addReleasePlan').html("");
										
									},
									error : function(data) {	
										$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
									}
								});	

								addReleaseDialog.dialog("open");	
								
							}
						});
						
						//Create release plan
						$("#createReleasePlan").unbind("click").on("click",function(){
							var releaseStDt=$("#releaseStartDate").val();
							var releaseEndDt=$("#releaseEndDate").val();
							var projId = $("#projects").val();
							if(releaseStDt == '' || releaseEndDt == ''){
								alert("Please select the release start date and end date to create the release plan!");
								return false;
							} 
														
							$.ajax({
								url : "./createReleasePlan.do",
								data : "releaseStartDate="+releaseStDt+"&releaseEndDate="+releaseEndDt+"&projId="+projId,									
								success : function(response) {
									$('#addReleasePlan').html(response);
								},
								error : function(data) {	
									$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
								}
							});	
						});
						
						//Fetch release plan
						$("#getReleasePlan").unbind("click").on("click",function(){
							var releaseStartDate=$("#editReleaseStartDateId").val();
							var releaseEndDate=$("#editReleaseEndDate").val();
							var releaseId = $("#releases option:selected").val();
							var projectId=$("#projects option:selected").val();
							
							if(releaseStartDate == '' || releaseEndDate == '' ){
								alert("Please select the release start date and end date to get the release plan!");
								return false;
							} 
							
							$.ajax({
								url : "./getReleasePlan.do",
								data : {releaseStartDate:releaseStartDate,
										releaseEndDate:releaseEndDate,
										releaseId : releaseId,
										projectId:projectId},									
								success : function(response) {
									$('#viewReleasePlan').html(response);
								},
								error : function(data) {	
									$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
								}
							});	
						});
						/*
						 * On selecting a project from drop down, 
						 * this function will fetch the corresponding releases.
						 */
						
						$("#projects").unbind("change").on("change", function() {
							var selectedProject=$("#projects").val();
							$.ajax({
								type : "POST",
								url : "./fetchReleases.do",
								data : {projectId:selectedProject},
								dataType : 'json',	
								
								beforeSend:function(){
								  },
								success : function(response) {
						
									$('#releases')
									  	.find('option')
									  	.remove();
									$('#releases').append('<option value="SR">Select Release</option>');
									for(var obj in response){
										$('#releases').append('<option value='+response[obj].id+'>'+response[obj].label+'</option>');
									};
								},
								error : function(data) {	
									$("#mainContainer").html("Application error! Please call help desk. Error:"+data.status);
								}
							});	
						});
						
						/*
						 * On selecting a release from drop down, 
						 * this function will fetch Project and Release details.
						 */
						
						$("#viewProjectPlan").button().unbind("click").on("click", function() {
							var selectedProject=$("#projects").val();
							var selectedRelease=$("#releases").val();
							if(selectedProject==0 && selectedRelease==0){
								alert("Please select project and Release to view the project plan!.");
							} else {
								var jsonRequest="{ \"projectId\" : \""+selectedProject+"\", \"releaseId\" : \""+selectedRelease+"\"}";
								$.ajax({
									type : "POST",
									url : "./viewProjectReleaseDetails.do",
									data : jsonRequest,
									contentType : 'application/json; charset=utf-8',
									beforeSend:function(){
									  },
									success : function(response) {
										$("#viewProjectAndReleaseDetails").html(response);
									},
									error : function(data) {	
										$("#mainContainer").html("Application error! Please call help desk.  Error:"+data.status);
									}
								});
							}
						});
						
						$("#existingProgram").unbind("change").on("change",function(){
							if($("#existingProgram").val()=='-1'){
								$("#newProgram").css("display", "inline");
							} else {
								$("#newProgram").css("display", "none");
							}
						});
						
					    $('#btn-add').unbind("click").on("click",function(){
					        $('#stringResources option:selected').each( function() {
					                $('#selectedResources1').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
					                $("#selectedResources1").focus();
					            $(this).remove();
					        });
					        sortList('selectedResources1');
					        return false;
					    });
					    $('#btn-addEdit').unbind("click").on("click",function(){
					        $('#stringResourcesEdit option:selected').each( function() {
					                $('#selectedResourcesEdit').append("<option value='"+$(this).val()+"' selected='selected'>"+$(this).text()+"</option>");
					                $("#selectedResourcesEdit").focus();
					                $(this).remove();
					        });
					        sortList('selectedResourcesEdit');
					        return false;
					    });
					    $('#btn-remove').unbind("click").on("click",function(){
					        $('#selectedResources1 option:selected').each( function() {
					            $('#stringResources').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
					            $(this).remove();
					        });
					        sortList('selectedResources1');
					        sortList('stringResources');
					        return false;
					    });		
					    $('#btn-removeEdit').unbind("click").on("click",function(){
					        $('#selectedResourcesEdit option:selected').each( function() {
					            $('#stringResourcesEdit').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
					            $(this).remove();
					        });
					        sortList('selectedResourcesEdit');
					        sortList('stringResourcesEdit');
					        return false;
					    });	
					     $("#startDateFilter").datepicker({
						 	showOn: 'button',
							buttonText: 'Show Date',
							buttonImageOnly: true,
							buttonImage: 'resources/cal.gif',
							dateFormat: 'mm/dd/yy',
							constrainInput: true,
							changeMonth: true, 
							changeYear: true 
					 }); 
					 $("#endDateFilter").datepicker({
						 	showOn: 'button',
							buttonText: 'Show Date',
							buttonImageOnly: true,
							buttonImage: 'resources/cal.gif',
							dateFormat: 'mm/dd/yy',
							constrainInput: true,
							changeMonth: true, 
							changeYear: true 
					 });
					
					});

	/*
	 * This function will be to update resource excel file into the system.
	 * FormData will work only in IE >=10
	 */
	
	function uploadResourceFile(){
		$('#result').html('');

		//Callback handler for form submit event
		$("#resourceFileUploadForm").submit(function(e){
		    var formObj = $(this);
		    var formURL = formObj.attr("action");
		    var formData = new FormData(this);
		    $.ajax({
		        url: formURL,
		        type: 'POST',
		        data:  formData,
		        mimeType:"multipart/form-data",
		        contentType: false,
		        cache: false,
		        processData:false,
		        success: function(data, textStatus, jqXHR){
		        	$('#result').html(data);
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		        	$('#result').html('Error uploading resource file.'+textStatus);
		        }         
		    });
		    e.preventDefault(); //Prevent Default action.
		    e.unbind();
		});
		$("#resourceFileUploadForm").submit(); //Submit the form
	}
	
	function generateId(id){
		var projectid=0;
		$("#"+id+" > option").each(function() {
			var tempValue=parseInt(this.value);
			if(projectid<tempValue){
				projectid=tempValue;
			}
		});
		return projectid;
	}
	

	function fnReset(){
		var projectName = document.forms["addProjectForm"]["projectName"].value;
		$("#projectName").val('');
		var startDate = document.forms["addProjectForm"]["startDate"].value;
		$("#startDate").val('');
		var endDate = document.forms["addProjectForm"]["endDate"].value;
		$("#endDate").val('');
		var projectDescription = document.forms["addProjectForm"]["projectDescription"].value;
		$("#projectDescription").val('');
		$('input:checkbox').removeAttr('checked');
    }

	function fnRemoveDuplicates(){
		var foundedinputs = [];
		$("select[name=existingProgram] option").slice(2).remove();
		$("select[name=projectLead] option").slice(1).remove();
	}

	function calculateTtlHrs(week) {
		var ttlHrs = 0;
		var flag = true;
		$('input[type=text][id*='+week+']').each(function(){
			if(this.id != week){
				if(/^\d+$/.test($(this).val())){
					ttlHrs = ttlHrs+Number($(this).val());
				}else{
					var val = $(this).val().toUpperCase();
					if(val != 'V' && val != 'P' && val != 'I' && val != ''){
						alert("Please provide valid entry of hours");
						flag = false;
						$(this).focus();
						return false;
					}else{
						$(this).val(val);
					}
				}
			}
		});
		if(flag){
			$('#'+week).html(ttlHrs);
		}
	}
	
	function downloadReport(){
		 
		 	var lReportType= $("#reportType").val();
			var lStartDate = $("#startDateFilter").val();
			var lEndDate = $("#endDateFilter").val();
			var lReportFormat = $("#reportFormat").val();
			var lProjectId = $("#projects").val();
			var lselectedRelease=$("#releases").val();
			
			if((lProjectId != '0') && (lselectedRelease != '0') && (lReportType != '0') && (lStartDate != '') && (lEndDate != '') && (lReportFormat != '0')){
				
				$('#statusForm').submit();
			}else{
				alert("Please enter the complete details");
				
			}
		 
		 
	 }
	 
	 function sortList(id){
		$("#"+id).html($('#'+id+' option').sort(function(x, y){
		       return $(x).text() < $(y).text() ? -1 : 1;
		}))
		$("#"+id).get(0).selectedIndex = 0;
		}
	
	function deleteComponent(componentId) {
		var id='cmpntDatta_'+componentId;
		$.ajax({
			type : "POST",
			url : "./deleteComponent.do",
			data : {
				componentId : componentId
			},
			beforeSend : function() {
			},
			success : function(response) {
				
				$("#viewProjectAndReleaseDetails #componentTable").find(
						'tr[id="' + id + '"]').remove();
				alert("Component Deleted Successfully!!");

				var url=$('#contextPath').val();
				window.location.href=url+'login.do';
			},
			error : function(data) {
				$("#projectWorkMenu").click();
	
			}
	
		});
	
	}
		
