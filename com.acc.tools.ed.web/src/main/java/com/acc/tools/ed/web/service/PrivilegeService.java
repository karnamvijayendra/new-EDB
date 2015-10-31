package com.acc.tools.ed.web.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import com.acc.tools.ed.web.dto.PrivilegesDTO;
import com.acc.tools.ed.web.dto.UserRoles;

public interface PrivilegeService {
	
	List<PrivilegesDTO> getAllMenuList() throws IOException, SQLException;
	
	List<UserRoles> getUserRoles() throws IOException, SQLException;

	String getRoleSpecificMenus(String roleId) throws IOException, SQLException;

	String updateRoleSpecificMenus(String userRole, String[] selectedMenuList) throws IOException, SQLException;

}
