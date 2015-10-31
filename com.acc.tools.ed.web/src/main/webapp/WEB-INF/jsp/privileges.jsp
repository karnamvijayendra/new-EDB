<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
 <%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<script type="text/javascript" src="script/libs/jquery-1.10.2.js"></script>
<script type="text/javascript" src="script/libs/jquery-ui-1.11.0.js"></script>
<script src="script/jquery.fancytree.js" type="text/javascript"></script>
 
<link href="css/ui.fancytree.css"  rel="stylesheet" type="text/css" />

<script type="text/javascript">

	function updateRoleSpecificMenu(){
		var roleId = $("#userRoles").find('option:selected').val();
		
		var request = $.ajax({
			  url: "updateUserSpecificRoles.do",
			  type: "POST",
			  data: {userRole : roleId, selectedMenu:$('#selectedList').val()},
			  dataType: "text"
			});

			request.done(function(msg) {
				alert(msg);
			});

			request.fail(function(jqXHR, textStatus) {
			  alert( "Request failed: " + textStatus );
			});
	}
  
  var treeData=${menuList};
  $(function(){

    // --- Initialize sample trees
    $("#menuTree").fancytree({
//      extensions: ["select"],
	source:treeData,
     activeVisible: true, // Make sure, active nodes are visible (expanded).
    aria: false, // Enable WAI-ARIA support.
    autoActivate: true, // Automatically activate a node when it is focused (using keys).
    autoCollapse: false, // Automatically collapse all siblings, when a node is expanded.
    autoScroll: true, // Automatically scroll nodes into visible area.
    clickFolderMode: 4, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
    checkbox: true, // Show checkboxes.
    debugLevel: 0, // 0:quiet, 1:normal, 2:debug
    disabled: false, // Disable control
    focusOnSelect: false, // Set focus when node is checked by a mouse click
    generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
    idPrefix: "ft_", // Used to generate node id´s like <span id='fancytree-id-<key>'>.
    icons: false, // Display node icons.
    keyboard: true, // Support keyboard navigation.
    keyPathSeparator: "/", // Used by node.getKeyPath() and tree.loadKeyPath().
    minExpandLevel: 1, // 1: root node is not collapsible
    quicksearch: true, // Navigate to next node by typing the first letters.
    selectMode: 3, // 1:single, 2:multi, 3:multi-hier
    tabbable: true, // Whole tree behaves as one single control
    titlesTabbable: false, // Node titles can receive keyboard focus
    select : function(e, data) {
        // Display list of selected nodes
        var s = data.tree.getPartialSelectedNodes().join(", ");
        $("#selectedList").val(s);
        
    }
    });

  });
  
	$(document).ready( function () {
		
		$("#menuTree").fancytree("getRootNode").visit(function(node){
	        node.setExpanded(true);
	       
	      });
		 $("#menuTree").fancytree("disable");
		 
		 
		 
  		$("#userRoles").change(function(){
  			
  			 			
  			$("#menuTree").fancytree("getRootNode").visit(function(node){
  		        node.setSelected(false);
  		      });
  			
  			var roleId = $(this).find('option:selected').val();
  			
  			if(roleId != 'NONE'){
  				$("#menuTree").fancytree("enable");
	  			var request = $.ajax({
	  			  url: "getUserSpecificRoles.do",
	  			  type: "POST",
	  			  data: {userRole : roleId},
	  			  dataType: "text"
	  			});
	
	  			request.done(function(msg) {
	  				if(msg.trim().length > 0) {
		  				var menuArray = msg.split(",");
		  				
		  				jQuery.each(menuArray, function(index, item) {
		  					
		  					 $("#menuTree").fancytree("getTree").activateKey(item);
		  					 var node = $("#menuTree").fancytree("getActiveNode");
		  					 if(!node.hasChildren()){
		  					 	node.setSelected(true);
		  					}
		  				});
	  				}
	  			});
	
	  			request.fail(function(jqXHR, textStatus) {
	  			  //alert( "Request failed: " + textStatus );
	  			});
  			
  			} else {
  				 $("#menuTree").fancytree("disable");
  			}
  			
	  		
  		});
	});
  
</script>
</head>

<body class="example">
  <h1>Assign User Controls</h1>

 <div id="divUserRoles">
 	<form:select id="userRoles" path ="userRoles">
	 	<form:option value="NONE" label="--- Select ---" />
	 	<form:options items="${userRoles}" itemLabel="roleName" itemValue="roleId" />
 	</form:select>
  </div>
  <div id="menuTree" class="fancytree-container">
  </div>
  
<input type="button" onclick="updateRoleSpecificMenu()" value="Update User Access List"/>

<input type="hidden" id="selectedList"/>

</body>
</html>