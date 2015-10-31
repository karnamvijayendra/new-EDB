<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style type="text/css">
/* CSSTerm.com Simple Horizontal DropDown CSS menu */
.drop_menu {
background: #3BB9FF;
border-radius: 10px;
padding: 0;
margin: 0;
list-style-type: none;
height: 30px;
border: thin;
font: 400 15px/1 "Open Sans", sans-serif;
}

.drop_menu li {
float: left;
}

.drop_menu li a {
padding: 9px 24px;
display: block;
color: #FFFFFF;
text-decoration: underline;
font: normal 400 15px/1 "Open Sans", sans-serif;
}

/* Submenu */
.drop_menu ul {
border-radius: 10px;
position: absolute;
left: -9999px;
top: -9999px;
list-style-type: none;
}

.drop_menu li:hover {
display: marker;
padding: 10px 25px;
border-radius: 10px;
position: relative;
text-align: inherit;
font: normal 400 15px/1 "Open Sans", sans-serif;
}

.drop_menu li:hover ul {
border-radius: 10px;
left: 0px;
top: 30px;
/* background:#FF7F3B; */
padding: 0px;
}

.drop_menu li:hover ul li a {
display: inline-block;
padding: 10px 25px;
background: #ccc
url('resources/images/button.png?w=1&h=38&bgt=gradient&bgc=fff&ebgc=ccc')
repeat-x;
background: -moz-linear-gradient(#fff, #ccc);
background: -o-linear-gradient(#fff, #ccc);
background: -webkit-linear-gradient(#fff, #ccc);
background: linear-gradient(#fff, #ccc);
border: 1px #ccc;
border-radius: 999px;
box-shadow: 0 2px 0 0 #666;
color: #000;
font: normal 400 18px/1 "Open Sans", sans-serif;
text-shadow: 1px 1px 0 #f3f3f3;
width:165px;
}

.drop_menu li:hover ul li a:hover {
border-radius: 10px;
display: block;
background: #3BBAFF;
width: 168px;
text-indent: 15px;
}
</style>
<link rel="stylesheet" type="text/css" href="menu.css" />
<title>CSS Simple Drop Down Menu</title>
</head>
<body>
<div class="drop">
<ul class="drop_menu">
<li><a href='#'>Project Management</a>
<ul>
<li><a href="privileges.do">Privileges</a></li>
<li><a href='#'>Sub Link 2</a></li>
</ul></li>
<li><a href='#'>Link 2</a>
<ul>
<li><a href='#'>Sub Link 1</a></li>
<li><a href='#'>Sub Link 2</a></li>
<li><a href='#'>Sub Link 3</a></li>
<li><a href='#'>Sub Link 4</a></li>
</ul></li>
<li><a href='#'>Link 3</a>
<ul>
<li><a href='#'>Sub Link 1</a></li>
<li><a href='#'>Sub Link 2</a></li>
<li><a href='#'>Sub Link 3</a></li>
<li><a href='#'>Sub Link 4</a></li>
</ul></li>


<li style="float: right;"><a href="logout.do">Logout</a></li>
<li style="float: right; font-size: 20px;">Enterprise
ID&nbsp;:Role</li>
</ul>
<%-- <table>
<tr>
<td>Logged in as:</td>
<td>${edbUser.enterpriseId}</td>
</tr>
<tr>
<td>Role:</td>
<td>${edbUser.role}</td>
</tr>
<tr>
<td></td>
<td><a href="logout.do">Logout</a></td>
</tr>
</table>
</ul> --%>
</div>

</body>
</html> 